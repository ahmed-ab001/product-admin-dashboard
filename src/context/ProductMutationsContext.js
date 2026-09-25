"use client";

/**
 * ProductMutationsContext
 *
 * Centralised client-side store for CRUD mutations that DummyJSON does NOT
 * persist server-side.  After a successful API call the caller records the
 * mutation here; every consumer then reads the derived (mutated) view without
 * re-fetching from the server.
 *
 * Three mutation types are tracked:
 *  - additions  : Array<product>  – products created in this session
 *  - edits      : { [id]: patch } – last-known local state of edited products
 *  - deletions  : Set<string>     – IDs of products deleted in this session
 *
 * Public helpers:
 *  - applyToList(fetchedProducts, fetchedTotal, { page, limit })
 *      Returns { products, total } with all mutations applied.
 *  - applyToProduct(product)
 *      Returns the mutated product, or null if it was deleted.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

// ── Context ───────────────────────────────────────────────────────────────────
const ProductMutationsContext = createContext(null);

// ── Reducer ───────────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  additions: [],      // newest first
  edits: {},          // { "42": { ...patchData } }
  deletions: new Set(),
};

function mutationsReducer(state, action) {
  const sid = action.id !== undefined ? String(action.id) : undefined;

  switch (action.type) {
    case "ADD":
      return {
        ...state,
        // Prepend so the newest item appears first on page 1
        additions: [action.product, ...state.additions],
      };

    case "EDIT": {
      const updatedAdditions = state.additions.map((p) =>
        String(p.id) === sid ? { ...p, ...action.patch } : p
      );
      return {
        ...state,
        edits: { ...state.edits, [sid]: action.patch },
        additions: updatedAdditions,
      };
    }

    case "DELETE": {
      const newDeletions = new Set(state.deletions);
      newDeletions.add(sid);
      const filteredAdditions = state.additions.filter(
        (p) => String(p.id) !== sid
      );
      // eslint-disable-next-line no-unused-vars
      const { [sid]: _removed, ...remainingEdits } = state.edits;
      return {
        ...state,
        deletions: newDeletions,
        additions: filteredAdditions,
        edits: remainingEdits,
      };
    }

    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ProductMutationsProvider({ children }) {
  const [state, dispatch] = useReducer(mutationsReducer, INITIAL_STATE);

  /** Record a product that was successfully POSTed to DummyJSON. */
  const recordAdd = useCallback((product) => {
    dispatch({ type: "ADD", product });
  }, []);

  /** Record a product that was successfully PUT on DummyJSON. */
  const recordEdit = useCallback((id, patch) => {
    dispatch({ type: "EDIT", id, patch });
  }, []);

  /** Record a product that was successfully DELETEd on DummyJSON. */
  const recordDelete = useCallback((id) => {
    dispatch({ type: "DELETE", id });
  }, []);

  /**
   * Merge local mutations into a fetched product list.
   *
   * Strategy:
   *  1. Remove any fetched products whose IDs appear in deletions.
   *  2. Replace fetched products with their locally-edited version.
   *  3. On page 1 prepend locally-added products (capped at the page limit).
   *  4. Adjust the total count accordingly.
   */
  const applyToList = useCallback(
    (fetchedProducts, fetchedTotal, { page = 1, limit = 10 } = {}) => {
      // Step 1 – filter deletions
      const afterDelete = fetchedProducts.filter(
        (p) => !state.deletions.has(String(p.id))
      );
      const deletedCount = fetchedProducts.length - afterDelete.length;

      // Step 2 – apply edits
      const afterEdit = afterDelete.map((p) => {
        const patch = state.edits[String(p.id)];
        return patch ? { ...p, ...patch } : p;
      });

      // Additions that haven't been subsequently deleted
      const visibleAdditions = state.additions.filter(
        (p) => !state.deletions.has(String(p.id))
      );

      // Adjust total: subtract deleted, add locally created
      const adjustedTotal = Math.max(
        0,
        fetchedTotal - deletedCount + visibleAdditions.length
      );

      let products;
      if (page === 1) {
        // Show additions first, then fill remaining slots from fetched list
        const remainingSlots = Math.max(0, limit - visibleAdditions.length);
        products = [...visibleAdditions, ...afterEdit.slice(0, remainingSlots)];
      } else {
        products = afterEdit;
      }

      return { products, total: adjustedTotal };
    },
    [state]
  );

  /**
   * Apply mutations to a single product object (used on the detail page).
   * Returns null if the product was locally deleted.
   */
  const applyToProduct = useCallback(
    (product) => {
      if (!product) return null;
      const sid = String(product.id);
      if (state.deletions.has(sid)) return null; // locally deleted
      const patch = state.edits[sid];
      return patch ? { ...product, ...patch } : product;
    },
    [state]
  );

  const value = useMemo(
    () => ({
      recordAdd,
      recordEdit,
      recordDelete,
      applyToList,
      applyToProduct,
      deletions: state.deletions,
    }),
    [recordAdd, recordEdit, recordDelete, applyToList, applyToProduct, state.deletions]
  );

  return (
    <ProductMutationsContext.Provider value={value}>
      {children}
    </ProductMutationsContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useProductMutations() {
  const ctx = useContext(ProductMutationsContext);
  if (!ctx) {
    throw new Error(
      "useProductMutations must be used within <ProductMutationsProvider>"
    );
  }
  return ctx;
}

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, h } from 'vue';

const products = [
  { name: 'Widget', code: 'W-100', quantity: 3 },
  { name: 'Gadget', code: 'G-200', quantity: 7 },
  { name: 'Doohickey', code: 'D-300', quantity: 0 },
  { name: 'Gizmo', code: 'Z-400', quantity: 12 },
  { name: 'Sprocket', code: 'S-500', quantity: 5 },
];

/**
 * DataTable scene: the plain static mode the v1 driver targets — 3 columns,
 * 5 rows, no sorting/filtering/selection/pagination/virtual scroll.
 */
export const DataTableExample = defineComponent({
  name: 'DataTableExample',
  setup() {
    return () =>
      h(
        DataTable,
        { value: products, 'data-testid': 'product-table' },
        {
          default: () => [
            h(Column, { field: 'name', header: 'Name' }),
            h(Column, { field: 'code', header: 'Code' }),
            h(Column, { field: 'quantity', header: 'Qty' }),
          ],
        }
      );
  },
});

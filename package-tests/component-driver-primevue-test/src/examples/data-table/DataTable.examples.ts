import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, h, ref } from 'vue';

const products = [
  { name: 'Widget', code: 'W-100', quantity: 3 },
  { name: 'Gadget', code: 'G-200', quantity: 7 },
  { name: 'Doohickey', code: 'D-300', quantity: 0 },
  { name: 'Gizmo', code: 'Z-400', quantity: 12 },
  { name: 'Sprocket', code: 'S-500', quantity: 5 },
];

/**
 * DataTable scene: the plain static mode the v1 driver targets — 3 columns,
 * 5 rows, no sorting/filtering/selection/pagination/virtual scroll. A second
 * table (`interactive-table`) turns on sorting, checkbox row selection and
 * pagination (#1034) — 5 rows, 2 per page, so paging is exercised.
 */
export const DataTableExample = defineComponent({
  name: 'DataTableExample',
  setup() {
    const selection = ref<(typeof products)[number][]>([]);
    return () =>
      h('div', [
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
        ),
        h(
          DataTable,
          {
            value: products,
            'data-testid': 'interactive-table',
            sortMode: 'single',
            selectionMode: 'multiple',
            selection: selection.value,
            'onUpdate:selection': (value: (typeof products)[number][]) => {
              selection.value = value;
            },
            paginator: true,
            rows: 2,
          },
          {
            default: () => [
              h(Column, { selectionMode: 'multiple', headerStyle: 'width: 3rem' }),
              h(Column, { field: 'name', header: 'Name', sortable: true }),
              h(Column, { field: 'code', header: 'Code' }),
              h(Column, { field: 'quantity', header: 'Qty', sortable: true }),
            ],
          }
        ),
      ]);
  },
});

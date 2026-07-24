import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import { defineComponent, h, reactive, ref } from 'vue';

const products = [
  { name: 'Widget', code: 'W-100', quantity: 3 },
  { name: 'Gadget', code: 'G-200', quantity: 7 },
  { name: 'Doohickey', code: 'D-300', quantity: 0 },
  { name: 'Gizmo', code: 'Z-400', quantity: 12 },
  { name: 'Sprocket', code: 'S-500', quantity: 5 },
];

/** A mutable copy for the filter/edit table — cell editing (#1034) writes back into it. */
const filterableProducts = reactive(products.map(p => ({ ...p })));

const virtualScrollRows = Array.from({ length: 100 }, (_, i) => ({
  name: `Item ${i}`,
  code: `C-${i}`,
  quantity: i,
}));

/**
 * DataTable scene: the plain static mode the v1 driver targets — 3 columns,
 * 5 rows, no sorting/filtering/selection/pagination/virtual scroll. A second
 * table (`interactive-table`) turns on sorting, checkbox row selection and
 * pagination (#1034) — 5 rows, 2 per page, so paging is exercised. A third
 * table (`filterable-table`, #1034) turns on `filterDisplay="menu"` column
 * filtering (Name) and `editMode="cell"` cell editing (Qty). A fourth table
 * (`virtual-scroll-table`, #1034) turns on `virtualScrollerOptions` over 100
 * rows — its driver coverage is e2e-only (see `DataTableDriver`'s class doc).
 */
export const DataTableExample = defineComponent({
  name: 'DataTableExample',
  setup() {
    const selection = ref<(typeof products)[number][]>([]);
    const filters = ref<Record<string, { value: unknown; matchMode: string }>>({
      name: { value: null, matchMode: 'contains' },
    });
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
        h(
          DataTable,
          {
            value: filterableProducts,
            'data-testid': 'filterable-table',
            filters: filters.value,
            'onUpdate:filters': (value: typeof filters.value) => {
              filters.value = value;
            },
            filterDisplay: 'menu',
            editMode: 'cell',
            onCellEditComplete: (event: { data: Record<string, unknown>; newValue: unknown; field: string }) => {
              event.data[event.field] = event.newValue;
            },
          },
          {
            default: () => [
              h(
                Column,
                { field: 'name', header: 'Name', filter: true, filterField: 'name' },
                {
                  filter: (slotProps: { filterModel: { value: string }; filterCallback: () => void }) =>
                    h(InputText, {
                      modelValue: slotProps.filterModel.value,
                      'onUpdate:modelValue': (v: string) => {
                        slotProps.filterModel.value = v;
                      },
                    }),
                }
              ),
              h(Column, { field: 'code', header: 'Code' }),
              h(
                Column,
                { field: 'quantity', header: 'Qty' },
                {
                  editor: (slotProps: { data: Record<string, unknown>; field: string }) =>
                    h(InputText, {
                      modelValue: String(slotProps.data[slotProps.field]),
                      'onUpdate:modelValue': (v: string) => {
                        slotProps.data[slotProps.field] = v;
                      },
                    }),
                }
              ),
            ],
          }
        ),
        h(
          DataTable,
          {
            value: virtualScrollRows,
            'data-testid': 'virtual-scroll-table',
            scrollable: true,
            scrollHeight: '400px',
            virtualScrollerOptions: { itemSize: 46 },
          },
          {
            default: () => [h(Column, { field: 'name', header: 'Name' }), h(Column, { field: 'code', header: 'Code' })],
          }
        ),
      ]);
  },
});

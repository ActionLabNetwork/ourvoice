/**
 * Type definition for any item with a specific property.
 */
type ItemWithProperty<TKey extends string | number | symbol, TValue = any> = {
  [P in TKey]: TValue
}

/**
 * Type definition for groups of items, grouped by a specific property value.
 */
type PropertyGroups<
  TKey extends string | number | symbol,
  TValue extends string | number | symbol,
  TItem extends ItemWithProperty<TKey, TValue>
> = Record<TValue, TItem[]>

/**
 * Function to group items by a specific property. The groups are formed based on the value of the property for each item.
 *
 * @example
 *
 * const items = [
 *   { status: 'pending', id: 1 },
 *   { status: 'accepted', id: 2 },
 *   { status: 'pending', id: 3 },
 * ];
 *
 * const initialGroups = {};
 *
 * const groupedItems = items.reduce(
 *   (groups, item) => getGroupsByProperty('status', groups, item),
 *   initialGroups
 * );
 *
 * console.log(groupedItems);
 * // Output:
 * // {
 * //   pending: [{ status: 'pending', id: 1 }, { status: 'pending', id: 3 }],
 * //   accepted: [{ status: 'accepted', id: 2 }],
 * // }
 *
 * @param {TKey} property - The property to group the items by.
 * @param {Partial<PropertyGroups<TKey, TValue, TItem>>} groups - The current groupings.
 * @param {TItem} item - The current item to be grouped.
 *
 * @returns {PropertyGroups<TKey, TValue, TItem>} - The updated groupings.
 */
export function getGroupsByProperty<
  TKey extends string | number | symbol,
  TValue extends string | number | symbol,
  TItem extends ItemWithProperty<TKey, TValue>
>(
  property: TKey,
  groups: Partial<PropertyGroups<TKey, TValue, TItem>>,
  item: TItem
): PropertyGroups<TKey, TValue, TItem> {
  const key = item[property]
  if (!groups[key]) {
    groups[key] = []
  }
  groups[key].push(item)
  return groups as PropertyGroups<TKey, TValue, TItem>
}

/**
 * Creates a key-value interface in order to achive
 * .NET dictionary base
 */
export interface IValuePair<TKey, TValue>
{
    key: TKey,
    value: TValue
}
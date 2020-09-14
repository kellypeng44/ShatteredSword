
// TODO - Is there already a way to do this in js/ts?
/**
 * An interface for all iterable data custom data structures
 */
export default interface Collection {
	/**
	 * Iterates through all of the items in this data structure.
	 * @param func 
	 */
	forEach(func: Function): void;

	/**
	 * Clears the contents of the data structure
	 */
	clear(): void;
}
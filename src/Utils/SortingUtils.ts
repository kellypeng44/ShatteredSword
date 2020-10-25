export default class SortingUtils {
	/**
	 * 
	 * @param arr 
	 * @param comparator Compares element a and b in the array. Returns -1 if a < b, 0 if a = b, and 1 if a > b
	 */
	static insertionSort<T>(arr: Array<T>, comparator: (a: T, b: T) => number): void {
		let i = 1;
		let j;
		while(i < arr.length){
			j = i;
			while(j > 0 && comparator(arr[j-1], arr[j]) > 0){
				SortingUtils.swap(arr, j-1, j);
			}
			i += 1;
		}
	}

	static swap<T>(arr: Array<T>, i: number, j: number){
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}
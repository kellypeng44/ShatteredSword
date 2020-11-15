export default class ArrayUtils {
    /**
     * Returns a 2d array of dim1 x dim2 filled with 1s
     * @param dim1 
     * @param dim2 
     */
    static ones2d(dim1: number, dim2: number): number[][] {
        let arr = new Array<Array<number>>(dim1);

        for(let i = 0; i < arr.length; i++){
            arr[i] = new Array<number>(dim2);

            for(let j = 0; j < arr[i].length; j++){
                arr[i][j] = 1;
            }
        }

        return arr;
    }

    static bool2d(dim1: number, dim2: number, flag: boolean): boolean[][] {
        let arr = new Array<Array<boolean>>(dim1);

        for(let i = 0; i < arr.length; i++){
            arr[i] = new Array<boolean>(dim2);

            for(let j = 0; j < arr[i].length; j++){
                arr[i][j] = flag;
            }
        }

        return arr;
    }
}
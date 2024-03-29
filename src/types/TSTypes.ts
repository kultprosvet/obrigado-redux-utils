interface PathArray<T, L> extends Array<string | number> {
    // @ts-ignore
    ["0"]?: keyof T;
    // @ts-ignore
    ["1"]?: L extends {
            ["0"]: infer K0;
        }
        ? K0 extends keyof T
            ? keyof T[K0]
            : never
        : never;
    // @ts-ignore
    ["2"]?: L extends {
            ["0"]: infer K0;
            ["1"]: infer K1;
        }
        ? K0 extends keyof T
            ? K1 extends keyof T[K0]
                ? keyof T[K0][K1]
                : never
            : never
        : never;
    // @ts-ignore
    ["3"]?: L extends {
            ["0"]: infer K0;
            ["1"]: infer K1;
            ["2"]: infer K2;
        }
        ? K0 extends keyof T
            ? K1 extends keyof T[K0]
                ? K2 extends keyof T[K0][K1]
                    ? keyof T[K0][K1][K2]
                    : never
                : never
            : never
        : never;
    // @ts-ignore
    ["4"]?: L extends {
            ["0"]: infer K0;
            ["1"]: infer K1;
            ["2"]: infer K2;
            ["3"]: infer K3;
        }
        ? K0 extends keyof T
            ? K1 extends keyof T[K0]
                ? K2 extends keyof T[K0][K1]
                    ? K3 extends keyof T[K0][K1][K2]
                        ? keyof T[K0][K1][K2][K3]
                        : never
                    : never
                : never
            : never
        : never;
    // @ts-ignore
    ["5"]?: L extends {
            ["0"]: infer K0;
            ["1"]: infer K1;
            ["2"]: infer K2;
            ["3"]: infer K3;
            ["4"]: infer K4;
        }
        ? K0 extends keyof T
            ? K1 extends keyof T[K0]
                ? K2 extends keyof T[K0][K1]
                    ? K3 extends keyof T[K0][K1][K2]
                        ? K4 extends keyof T[K0][K1][K2][K3]
                            ? keyof T[K0][K1][K2][K3][K4]
                            : never
                        : never
                    : never
                : never
            : never
        : never;
    // @ts-ignore
    ["6"]?: L extends {
            ["0"]: infer K0;
            ["1"]: infer K1;
            ["2"]: infer K2;
            ["3"]: infer K3;
            ["4"]: infer K4;
            ["5"]: infer K5;
        }
        ? K0 extends keyof T
            ? K1 extends keyof T[K0]
                ? K2 extends keyof T[K0][K1]
                    ? K3 extends keyof T[K0][K1][K2]
                        ? K4 extends keyof T[K0][K1][K2][K3]
                            ? K5 extends keyof T[K0][K1][K2][K3][K4]
                                ? keyof T[K0][K1][K2][K3][K4][K5]
                                : never
                            : never
                        : never
                    : never
                : never
            : never
        : never;
}

type ArrayHasIndex<MinLenght extends number> = { [K in MinLenght]: any };

export type PathArrayValue<
    T,
    L extends PathArray<T, L>
    > = L extends ArrayHasIndex<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>
    ? any
    : L extends ArrayHasIndex<0 | 1 | 2 | 3 | 4 | 5 | 6>
        ? T[L[0]][L[1]][L[2]][L[3]][L[4]][L[5]][L[6]]
        : L extends ArrayHasIndex<0 | 1 | 2 | 3 | 4 | 5>
            ? T[L[0]][L[1]][L[2]][L[3]][L[4]][L[5]]
            : L extends ArrayHasIndex<0 | 1 | 2 | 3 | 4>
                ? T[L[0]][L[1]][L[2]][L[3]][L[4]]
                : L extends ArrayHasIndex<0 | 1 | 2 | 3>
                    ? T[L[0]][L[1]][L[2]][L[3]]
                    : L extends ArrayHasIndex<0 | 1 | 2>
                        ? T[L[0]][L[1]][L[2]]
                        : L extends ArrayHasIndex<0 | 1>
                            ? T[L[0]][L[1]]
                            : L extends ArrayHasIndex<0>
                                ? T[L[0]]
                                : never;

export type Path<T, L> = PathArray<T, L> | keyof T;

export type PathValue<T, L extends Path<T, L>> = L extends PathArray<T, L>
    ? PathArrayValue<T, L>
    : L extends keyof T
        ? T[L]
        : any;

export type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
            T[P];
};


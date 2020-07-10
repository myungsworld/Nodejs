//generic 을 사용한 스택 구현

class stack<T> {
    private data : T[] = [];

    constructor() {}

    push (item: T) : void {
        this.data.push(item);
    }

    pop() : T {
        return this.data.pop();
    }
}

//number 타입 사용
const numberStack = new stack<number>();
numberStack.push(1);
//string 타입 사용
const stringStack = new stack<string>();
stringStack.push("1");

//배열을 입력을 받아 그 배열의 첫번쨰 요소를 출력하는 함수 구현
function getFirstElement<T>(arr : T[]): T {
    return arr[0];
}
getFirstElement<number>([1,2,3]);

//두개 이상의 타입변수
function twogeneric<T,U>(a : T , b : U):[T,U] {
    return [a ,b];
}
twogeneric<string,number>("이건 스트링", 15);

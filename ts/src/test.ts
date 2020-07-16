
// //var은 호이스팅 가능 재선언가능 타입스크립트에선 왠만하면 const,let 씀
// console.log(thisisvar);
// var thisisvar = "thisisvar"

// console.log(thisislet)
// let thisislet = "thisislet"

// //b는 리터럴 타입 이라고 한다 추론으로
// //const a : string = "에이"
// //const b = "비이"

// //type assertions 두가지 방법중 밑에 방법을 많이 쓴다
// let someValue: any = "this is a string";

// let stringLength : number = (<string>someValue).length;
// let strLength : number = (someValue as string).length;

// //type alias (타입 별칭)
// //Union type
// type stringOrNumber = string | number;

// let a: any;
// let b: stringOrNumber;

// b=``;
// b=0;

// function test(arg:stringOrNumber): stringOrNumber{
//     return arg;
// }

// // Tuple 

// let person : [string , number] = ['song',27];

// type personTuple = [string , number];
// let another : personTuple = ['youmin', 26];

// //Type Alias 로 Generic 표현하기

//interface 만들기

interface Person {
    name :string;
    age : number;
}



const hello = (p:Person) : void => {
    console.log(`안녕하세요 ${p.name} 입니다. 나이는 ${p.name} 입니다`);
}

const person : Person = {
    name : "song",
    age : 27
};

hello(person);
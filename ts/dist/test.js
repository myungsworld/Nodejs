const hello = (p) => {
    console.log(`안녕하세요 ${p.name} 입니다. 나이는 ${p.name} 입니다`);
};
const person = {
    name: "song",
    age: 27
};
hello(person);

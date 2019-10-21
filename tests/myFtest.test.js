// npm test
// const thefile = require('../lib');
test('My first test', () => {
 // throw new Error('Something failed')
});

// test('this is a test', () => {
//     const result = lib.absolute(1);
//     expect(result).toBe(1); 
// });

// expect(value).toBeGreaterThanOrEqual();
// expect(value).ToBe();
// expect(value).ToBeEqual();
// expect(value).toBeLessThan();
// expect(value).toBeLessThanOrEqual();
// expect(value).toBeGreaterThan();
 

// if working with float numbers
// toBeCloseTo()

// grouping a bunch of related tests
// we replace test with it
describe('absolute', () => {
     // all the tests related to one function absolute 
     it('first test', () => {

     })
});

// testing strings
// test a greetings function
// use regular expressions to test the strings
// when testing strings make sure 
// your tests are neither to specific or too general
// describe('greet', () => {
//     it('should return the greeting message', () => {
//         const result = lib.greet('Mariam');
//         expect(result).toMatch(/Mariam/);
//         // expect(result).toContain('Mariam');
//     });
// });

// testing arrays
function getCurrencies() {
    return ['USD', 'AUD', 'EUR'];
}
describe('getCurrencies', () => {
    it('Should return supported currencies', () => {
        const result = getCurrencies();
        // too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        // Too specific
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');
        expect(result.length).toBe(3);

        // too specific but the recommanded
        // propper way
        expect(result[0]).toContain('USD');
        expect(result[1]).toContain('AUD');
        expect(result[2]).toContain('EUR');

        // Ideal way
        expect(result).toEqual(expect.arrayContaining(['USD', 'EUR', 'AUD']));
    });
});

// testing the objects
function getProduct(productId) {
    return { id: productId, price: 10, category: "a category"};
}

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = getProduct(1);
        // wrong u can not compare objects due to memory issues
        // expect(result).toBe({ id: 1, price: 10});
        // right
        expect(result).toMatchObject({ id: 1, price: 10});
        expect(result).toHaveProperty('id', 1);
    });
});

// testing Exceptions
function registerUser(username) {
    if(!username) throw new Error('Username is requires');
    return { id: new Date().getTime(), username: username}
}

describe('registerUser', () => {
    it('should throw an error if username is false', () => {
        //Null
        //undefined
        //NaN
        // ''
        // 0
        //false
        const args = [null, undefined, NaN, 0, false, ''];
        args.forEach( a => {
            expect(() => { registerUser(undefined); }).toThrow();
        });
    });

    it('should return a user object if valid username is passed', () => {
        const result = registerUser('Mariam');
        expect(result).toMatchObject({ username: 'Mariam' });
        expect(result.id).toBeGreaterThan(0);
    });
});


function fizzBuzz(input) {
    if(typeof input !== 'number') throw new Error('Input should be a number.')   
    if( (input % 3 === 0) && (input % 5 === 0) ) return 'FizzBuzz';
    if (input % 3 === 0) return 'Fizz';
    if (input % 5 === 0 ) return 'Buzz';
    return input;
}

describe('fizzBuzz', () => {
    it('not a number should throw error', () => {
        expect(() => { fizzBuzz('hh'); }).toThrow();
        expect(() => { fizzBuzz(null); }).toThrow();
        expect(() => { fizzBuzz(undefined); }).toThrow();
        expect(() => { fizzBuzz(false); }).toThrow();
        expect(() => { fizzBuzz([]); }).toThrow();
        expect(() => { fizzBuzz({}); }).toThrow();
    });
    it('9 is multiple of  3 it should return Fizz', ()=> {
        const result = fizzBuzz(9);
        expect(result).toBe('Fizz');
    });
    it('10 is multiple of 5 it should return Buzz', () => {
        const result = fizzBuzz(10);
        expect(result).toBe('Buzz');
    });
    it('15 is multiple pf 5 and 3 it should return FizzBuzz', () => {
        const result = fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });
    it('4 is not a multiple of 3 neither 5 it should return 4', () => {
        const result = fizzBuzz(4);
        expect(result).toBe(4);
    });

});


// a mock function or a fake function
// toHavebeenCalled()
// toHaveBeenCalledWith('a', '...')


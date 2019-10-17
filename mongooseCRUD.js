const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground',
    { useUnifiedTopology: true },
    { useNewUrlParser: true })
    .then(() => dbDebugger('Connected to MongoDB 😍😍😍 ...'))
    .catch(err => dbDebugger('Could not connect to MongoDB 🤎.............', err));
  
// Schema Types
/*
String
Number
Date
Buffer
Boolean
ObjectID
Array 
*/
var Schema = mongoose.Schema;
const courseSchema = new Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

// a class
const Course = mongoose.model('Course', courseSchema);


async function createCourse() {
    // an object of the class
    const course = new Course({
        name: 'ggggggg',
        author: 'hhhhhhhhhhhhhhh',
        tags: ['lllll', 'bbbbb'],
        isPublished: true
    });
    const result = await course.save();
    console.log(result);
}

// Comparison Query Operators
// eq (equal)
// ne (not equal)
// gt (greater than)
// gte (greater than or equal)
// lt (less than)
// lte (less than or equal to)
// in 
// nin (not in)

//Logical Query Operators
// or
// and

// Regular Expressions
// starts with Mariam
// .find({ author: /^Mariam/ })
// Ends with Machaallah i for case insensitive
// .find( { author: /MAchaallah$/i } )
// Contains Mosh it can at the beginning, the middle or the end
// .find( { author: /.*Mosh.*/} )

// Counting
// add .count();
// .find().count();
// .find().limit().sort().count();  

async function getCourses() {
    const courses = await Course
        .find({ name: 'mememe', isPublished: true })
        // for comparison
        // .find({ price: { $gte: 10, $lte: 20 } })
        // .find({ price: { $in: [10, 15, 20]} })
        // .find( { price:  })

        // .or([ {name: 'mememe'}, { isPublished: true} ])

        .limit(10)
        .sort({ name: 1 }) // 1 means ascending order -1 descending order
        .select({ name: 1, date: 1 });
    console.log(courses);
}



createCourse();
getCourses();

// Pagination we use .skip()
// Example 
async function getCourses() {
    const pageNumber = 2;
    const pageSize = 10;
    const courses = await Course
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
    console.log(courses)
}


// Updating Documents
async function updateCourse(id) {
    // Approach: Query first
    // find a document findById()
    // modify its properties
    // save()
    const course = await Course.findById(id);
    if (!course) return;
    course.set({
        isPublished: true,
        author: 'Another author'
    });
    const result = await course.save();
    console.log(result);

    // Approach: Update first 
    // update directly
    // Optionally: get the updated document 
    // update all the isPublished is false
    const result = await Course.update({ isPublished: false },
        {
            $set: {
                author: 'Mosh',
                isPublished: true
            }
        });
    console.log(result);

    //
    const resu = await Course.findByIdAndUpdate(id, {
        $set: { author: 'Mosh', isPublished: true }
    }, { new: true });
    console.log(resu);
}


// Remove a document
async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    // deleteMany({ isPublished: true});
    // const course = await Course.findByIdAndRemove(id);
    console.log(result)
}


//////////////////////   Mongoose Data Validation

// add the required validator built-in validator
// name: { type: String, required: true }
// try { await course.save(); } catch (ex) { console.log(ex.mwssage) }
// or
// try { await course.validate(); } catch (ex) { console.log(ex.mwssage) }

//  if isPublished is true price will be required
// you can not use arrow function 
// because arrow functions does not have this

// const coureSchema = new mongoose.Schema({
//     isPublished: Boolean,
//     price: {
//         type: Number,
//         required: function() { return this.isPublished; }
//     }
// });


// name: { 
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 255, 
//     match: /patten/ 
// }

// category: {
//     type: String,
//     enum: [ 'web', 'mobile', 'network']
// }

// custom validator
// the array should not be empty
// tags: {
//     type: Array,
//     validate: {
//         validator: function(v) {
//            return v && v.length > 0; 
//         }, 
//         message: 'the course should have at least one tag.'
//     }
// }

// Async validators
//     validate: {
//         isAsync: true,
//         validator: function(v, callback) {
//            setTimeout( () => {
//                  const result =  v && v.length > 0; 
//                  callback(result);
//            }, 4000)
//         }, 
//         message: 'the course should have at least one tag.'
//     }


// Validation Errors
// catch all the errors
// try {
//     // saving a course
// } catch (ex) {
//     for(field in ex.errors) {
//         console.log(ex.errors[field]);
//     }
// }

// ///////////////////// SchemaType Options
//////////////// for strings: 
// lowercase: true
// uppercase: true
// trim: true // to remove additional paddings

/////////////// for numbers
// min: 10
// max: 40
// get: v => Math.round(v)
// set: v => Math.round(v)
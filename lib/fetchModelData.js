/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 * @returns a Promise that should be filled with the response of the GET request
 * parsed as a JSON object and returned in the property named "data" of an
 * object. If the request has an error, the Promise should be rejected with an
 * object that contains the properties:
 * {number} status          The HTTP response status
 * {string} statusText      The statusText from the xhr request
 */
// function fetchModel(url) {
//   return new Promise((resolve, reject) => {
//     fetch(url) 
//       .then((response) => {
//         if (!response.ok) {
//           // Reject with an Error object that includes status and statusText
//           return reject(new Error(`Error ${response.status}: ${response.statusText}`));
//         }
//         // Return the JSON promise
//         return response.json();
//       })
//       .then((data) => {
//         resolve({ data }); // Resolve with the data placed in a "data" property
//       })
//       .catch((error) => {
//         // Reject with a network error
//         reject(new Error(`Network error: ${error.message || error}`));
//       });
//   });
// }


// export default fetchModel;

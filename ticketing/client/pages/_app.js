/*
  This custom app component is made to include on every page the global css
  in this case - bootstrap.
  But we can also use it to show elements on screen that will be visible on every page
  
*/

import 'bootstrap/dist/css/bootstrap.css';

// The Component prop is the page we want to show so we can also wrap it
// With other JSX    
export default ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header</h1>
      <Component {...pageProps} />  
  </div>
  );
};

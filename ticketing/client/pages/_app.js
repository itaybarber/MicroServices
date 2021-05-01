/*
  This custom app component is made to include on every page the global css
  in this case - bootstrap.
  But we can also use it to show elements on screen that will be visible on every page
  
*/

import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

import Header from '../components/header';

// The Component prop is the page we want to show so we can also wrap it
// With other JSX    
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/> 
      <Component {...pageProps} />  
  </div>
  );
};

// getInitialProps
// זו מתודה של נקסט ואם נחליט לממשה (כמו פה) אז נקסט ידע לקרוא לה
// כאשר הוא מנסה לרנדר את האפליקציה כשהוא על השרת ופה נמצאת
// ההזמדנות שלנו ללעשות פאטש' לדאטה מהשרת שהקומפונטה צריכה
// כשעובדים בקוברנטיס באינגרס אנג'ינקס והבקשה צריכה להשלח לסרוויס אחר
// היא לא תגיע ונקבל שגיאה וכדי לתקן את זה צריך לקנפג את אקסיוס שידע מאיפה לשלוח - מהבראוזר או מנקסט.גס
// ואקסיוס ייגש לאינגרס אנג'ינאקס - הבעיה שהיא שהוא לא יודע מה הכתובת
// ארגומנטים שלה שונים כאשר מדובר בעמוד וכאשר מדובר בקומפוננטה פרי עטנו
// Page component => receives context === {req, res}. Req had headers from users' browser
// Custom component => receives context === {Component, ctx: {req, res}}
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const {data} = await client.get('api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {  // For pages that don't define getInitalProps
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { 
    pageProps,
    currentUser: data.currentUser};  // We can also write: ...data cause the data is gonna have a currentUser property
}

export default AppComponent; 
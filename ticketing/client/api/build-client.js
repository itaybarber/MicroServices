/*
    Build client suppose to take headres from cookie and to build the client
    wheather it emarged from browser or node/server by sending requests for data
    to relevant pathes
*/

import axios from 'axios'; // משתמשים באקסיוס למרות שיש לנו את ההוק כדי שנקסט יוכל לעשות רקווסט אוט' סרוויס
// בגלל שהוק יכול להיות משומש רק בתוך קומפוננטות ריאקט. ואנחנו בגט איניטיאל פרופס צריכים לעשות את הרקווסט

export default ({req}) => {
    if (typeof window === 'undefined') { // חלון הוא אובייקט שקיים רק בתוך בראוזר לכן אם לא מוגדר- אנחנו על השרת
        return axios.create({
            baseURL: 'http://ingress-nginx.ingress-nginx.svc.cluster.local',
              // Format is: http://SERVICENAME.NAMESPACE.svc.cluster.local 
              // To get all namespaces: kubectl get namespace
              // To get all services inside that namespace: kubectl get services -n namespaceName
            headers: req.headers 
            //   Host: 'ticketing.dev' // This is for nginx, to know for which domain we need as specified in the rules of ingress-srv.yaml
        });
    } else {
  // We must be on the browser
        return axios.create({
            baseUrl: '/'// נהיה במצב הזה, רק כאשר הדף הוא רי-דירקטד מתוך דף אחר באפליקצי. ריפרש או הכנסת היו.ר.ל או ריידרקט מאפליקצי אחרת יביא אותנו לשרת
        });
    }
};
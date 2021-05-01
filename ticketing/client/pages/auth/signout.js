import Router from 'next/router';
import {useEffect} from 'react';
import useRequest from '../../hooks/use-request';

//  כשהקומפוננטה הנ"ל תתרנדר, נשתמש ב יוז-אפקט-הוק, כדי שינסה לעשות בקשה דרך יוז רקווסט
export default () =>
{
  const {doRequest} = useRequest({
     url: '/api/users/signout',
     method: 'post',
     body: {},
     onSuccess: () => {
       Router.push('/');
     }
  }); // We'll get do request func when we call to useRequest 
  
    useEffect(() => {
      doRequest();
    }, []) // Since we want to run it only once, the 2nd arg is gonna be an empty arr
  
  return (
    <div>
      Signing out...
    </div>
  );
}
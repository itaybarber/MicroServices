import {useState} from 'react'
import Router from 'next/router'; // in order to navigate user around pages
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState(''); // Those are react hooks, to keep the state. Defaulted to an empty string
  const [password, setPassword] = useState('');

  const {doRequest, errors} = useRequest({
    url: '/api/users/signup', 
    method: 'post', 
    body: {
      email, 
      password
    },
    onSuccess: () => Router.push('/') // To navigate the user to main page
   }); 

  const onSubmit = async (event) => {
    event.preventDefault(); // In order that the form won't sumbit itself to the browser
    
    await doRequest();
    
    
  }
  
  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input value={email} onChange={e =>setEmail(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
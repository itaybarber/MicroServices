import axios from 'axios';
import {useState} from 'react';

export default ({url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;  // axios is responsible to put the data from the request in response.data 
    
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
        <h4>Oppsssss...</h4>
        <ul className="my-0">
          {err.response.data.errors.map(err => (
        // err.response.data. We're going to receive an error object that contains an array of errors, each error has a msg and possibly a field */ 
            <li key={err.message}>{err.message}</li>
            ))} 
        </ul>
      </div>
      );
    }
  };

    return {doRequest, errors}; // The defualt convention of react hooks is to return an array
};
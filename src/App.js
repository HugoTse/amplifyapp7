import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from "react";
import { Auth, Hub, API, Storage } from 'aws-amplify';
// import { listGobjs } from './graphql/queries';
// import { createGobj as createGobjMutation, deleteGobj as deleteGobjMutation, updateGobj as updateGobjMutation } from './graphql/mutations';

import Amplify from 'aws-amplify';
import config from './aws-exports.js';
Amplify.configure(config);

const initialFormState = { customer: '', service: '', claim: '', winloss: '', priority: '', serviceteam: '', user: '' }

// Amplify.configure(config);

function App() {
  // For Midway authentication
  const [user ,setUser] = useState(null);

  // useEffect(() => {
  //   Hub.listen('auth', ({ payload: { event, data } }) => {
  //     switch (event) {
  //       case 'signIn':
  //         console.log(event)
  //         console.log(data)
  //         getUser().then(userData => setUser(userData));
  //         break;
  //       case 'signOut':
  //         setUser(null);
  //         break;
  //       case 'signIn_failure':
  //         console.log('Sign in failure', data);
  //         break;
  //     }
  //   });

  //   getUser().then(userData => setUser(userData));
  // }, []);

  // function getUser() {
  //   return Auth.currentAuthenticatedUser()
  //     .then(userData => userData)
  //     .catch(() => console.log('Not signed in'));
  // }


  // For Gobj
  // const [gobjs, setGobjs] = useState([]);
  // const [formData, setFormData] = useState(initialFormState);

  // useEffect(() => {
  //   fetchGobjs();
  // }, []);

  // async function fetchGobjs() {
  //   const apiData = await API.graphql({ query: listGobjs });
  //   setGobjs(apiData.data.listGobjs.items);
  // }

  // async function createGobj() {
  //   if (!formData.customer) return;
  //   await API.graphql({ query: createGobjMutation, variables: { input: formData } });
  //   setGobjs([ ...gobjs, formData ]);
  //   setFormData(initialFormState);
  // }

  // async function deleteGobj({ id }){
  //   const newGobjArray = gobjs.filter(gobj => gobj.id !== id);
  //   setGobjs(newGobjArray);
  //   await API.graphql({ query: deleteGobjMutation, variables: { input: { id } }});
  // }

  // async function editGobj({ id }){
  //   if(!formData.customer) return;
  //   await API.graphql({ query: updateGobjMutation, 
  //                              variables: { input: { id: id, 
  //                                                    name: formData.customer, 
  //                                                    service: formData.service,
  //                                                    claim: formData.claim,
  //                                                    winloss: formData.winloss,
  //                                                    priority: formData.priority,
  //                                                    serviceteam: formData.serviceteam,
  //                                                    user: formData.user
  //                                                   } }});
  //   fetchGobjs();
  // }

  return (
    <div className="App">
      {/* For Midway Authentication */}
      {user ? (
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => Auth.federatedSignIn({customProvider: "AmazonFederate"})}>Signin With Midway</button>
      )}

      {/* For Gobj */}
      <h1>Dashboard</h1>
       {/* Customer, SA, Gap input  */}
       <textarea
          // onChange={e => setFormData({ ...formData, 'customer': e.target.value})}
          placeholder="Customer, SA, Gap"
          // value={formData.customer}
        />
        {/* Service  */}
        <textarea
          // onChange={e => setFormData({ ...formData, 'service': e.target.value})}
          placeholder="Service"
          // value={formData.service}
        />
        {/* Claim  */}
        <textarea
          // onChange={e => setFormData({ ...formData, 'claim': e.target.value})}
          placeholder="GCP Claim/Customer Feedback"
          // value={formData.claim}
        />        
        {/* Win/Loss  */}
        <textarea
          // onChange={e => setFormData({ ...formData, 'winloss': e.target.value})}
          placeholder="Win/Loss to GCP? Key factor resulting in loss and learnings"
          // value={formData.winloss}
        />
        {/* Priority  */}
        <textarea
          // onChange={e => setFormData({ ...formData, 'priority': e.target.value})}
          placeholder="Priority/AWS GCP Compete Team Response"
          // value={formData.priority}
        />
        {/* Service Team  */}
        <textarea
          // onChange={e => setFormData({ ...formData, 'serviceteam': e.target.value})}
          placeholder="Service Team PFR/Roadmap"
          // value={formData.serviceteam}
        />
        {/* User  */}
        <input
          // onChange={e => setFormData({ ...formData, 'user': e.target.value})}
          placeholder="User"
          // value={formData.user}
        />
        {/* <button onClick={createGobj}>Add</button> */}
        <div style={{marginBottom: 30}}></div>

        {/* {
          gobjs.map(gobj => (
            <tr key={gobj.id}>
              <td>{gobj.customer}</td>
              <td>{gobj.service}</td>
              <td>{gobj.claim}</td>
              <td>{gobj.winloss}</td>
              <td>{gobj.priority}</td>
              <td>{gobj.serviceteam}</td>
              <td>{gobj.user}</td>
              <td><button onClick={() => deleteGobj(gobj)}>Delete</button></td>
              <td><button onClick={() => editGobj(gobj)}>Edit</button></td>
            </tr>
          ))
        } */}
    </div>
  );
}

export default App;

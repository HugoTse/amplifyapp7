// import logo from './logo.svg';
// import './App.css';

import React, { useState, useEffect } from "react";
import { Auth, Hub, API, Storage } from 'aws-amplify';
import { listGobjs } from './graphql/queries';
import { createGobj as createGobjMutation, deleteGobj as deleteGobjMutation, updateGobj as updateGobjMutation } from './graphql/mutations';

import Amplify from 'aws-amplify';
import config from './aws-exports.js';
Amplify.configure(config);

const initialFormState = { customer: '', 
                           service: '', 
                           claim: '', 
                           winloss: '', 
                           priority: '', 
                           serviceteam: '', 
                           user: '',
                           ccustomer: '',
                           cservice:'',
                           cclaim: '',
                           cwinloss: '',
                           cpriority: '',
                           cserviceteam: '',
                           cuser: '' }

function App() {
  // For Midway authentication
  const [user, setUser] = useState(null);

  // For changing adding state
  const [adding, setAdding] = useState(false);

  // For changing editing state
  const [editing, setEditing] = useState('');

  // Midway Authentication
  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          console.log(event)
          console.log(data)
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
          console.log('Sign in failure', data);
          break;
      }
    });
    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }


  // For Gobj
  const [gobjs, setGobjs] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchGobjs();
  }, []);

  async function fetchGobjs() {
    const apiData = await API.graphql({ query: listGobjs });
    setGobjs(apiData.data.listGobjs.items);
  }

  async function createGobj() {
    if (!formData.customer) return;
    // await API.graphql({ query: createGobjMutation, variables: { input: formData } });
    await API.graphql({ query: createGobjMutation, variables: { input: { customer: formData.customer, 
                                                                         service: formData.service,
                                                                         claim: formData.claim,
                                                                         winloss: formData.winloss,
                                                                         priority: formData.priority,
                                                                         serviceteam: formData.serviceteam,
                                                                         user: formData.user
                                                                        } } });
    setGobjs([ ...gobjs, formData ]);
    setFormData(initialFormState);
    setAdding(!adding);
    setEditing('');
    window.location.reload();
  }

  async function deleteGobj({ id }){
    const newGobjArray = gobjs.filter(gobj => gobj.id !== id);
    setGobjs(newGobjArray);
    await API.graphql({ query: deleteGobjMutation, variables: { input: { id } }});
  }

  async function editGobj({ id }){
    console.log(id);
    setEditing(id);
    if(!formData.ccustomer) return;
    await API.graphql({ query: updateGobjMutation, 
                               variables: { input: { id: id, 
                                                     customer: formData.ccustomer, 
                                                     service: formData.cservice,
                                                     claim: formData.cclaim,
                                                     winloss: formData.cwinloss,
                                                     priority: formData.cpriority,
                                                     serviceteam: formData.cserviceteam,
                                                     user: formData.cuser
                                                    } }});
    setEditing('');
    setFormData({ ...formData, 'ccustomer': ''})
    setFormData({ ...formData, 'cservice': ''})
    setFormData({ ...formData, 'cclaim': ''})
    setFormData({ ...formData, 'cwinloss': ''})
    setFormData({ ...formData, 'cpriority': ''})
    setFormData({ ...formData, 'cserviceteam': ''})
    setFormData({ ...formData, 'cuser': ''})
    setFormData(initialFormState);
    // window.location.reload();
    fetchGobjs();
  }

  // For changing adding state
  async function changeAdding(){
    setAdding(!adding);
    console.log(adding);
  }

  return (
    <div className="App">
      {/* For Midway Authentication */}
      {user ? (
        <>
        <div>
          <button 
            className='signinorout'
            onClick={() => Auth.signOut()}>Sign Out</button>
        </div>
        <h1>Dashboard</h1>
        <div style={{marginBottom: 30}}></div>
        <table>
          <thead>
            <tr>
              <td className='tableheader'>Customer, SA, <em>Gap</em></td>
              <td className='tableheader'>Service</td>
              <td className='tableheader'>GCP Claim / Customer Feedback</td>
              <td className='tableheader'>Win / Loss to GCP? Key factor resulting in loss and learnings</td>
              <td className='tableheader'>Priority / AWS GCP Compete Team Response</td>
              <td className='tableheader'>Service Team PFR / Roadmap</td>
              { adding? (<button className='showAddButton' onClick={e => changeAdding()}>HIDE ADDING ROW</button>) :
              (<button className='showAddButton' onClick={e => changeAdding()}>SHOW ADDING ROW</button>) }
            </tr>
          </thead>
            <tbody>
              {/* Row for adding data */}
              { adding? 
              (
              <tr>
                <td>
                  {/* Customer, SA, Gap input  */}
                  <textarea
                    className='inputStyle'
                    onChange={e => setFormData({ ...formData, 'customer': e.target.value})}
                    placeholder="Customer, SA, Gap"
                    value={formData.customer}
                  />
                </td>
                <td>
                  {/* Service  */}
                  <textarea
                    className='inputStyle'
                    onChange={e => setFormData({ ...formData, 'service': e.target.value})}
                    placeholder="Service"
                    value={formData.service}
                  />
                </td>
                <td>
                  {/* Claim  */}
                  <textarea
                    className='inputStyle'
                    onChange={e => setFormData({ ...formData, 'claim': e.target.value})}
                    placeholder={"GCP Claim/Customer Feedback"}
                    value={formData.claim}
                  />        
                </td>
                <td>
                  {/* Win/Loss  */}
                  <textarea
                    className='inputStyle'
                    onChange={e => setFormData({ ...formData, 'winloss': e.target.value})}
                    placeholder="Win/Loss to GCP? Key factor resulting in loss and learnings"
                    value={formData.winloss}
                  />
                </td>
                <td>
                  {/* Priority  */}
                  <select name="priority" 
                          id="addPriority" 
                          required 
                          value={formData.priority} 
                          onChange={(e) => setFormData({ ...formData, 'priority': e.target.value})}>
                      <option>Select Priority</option>
                      <option value="Priority: High">Priority: High</option>
                      <option value="Priority: Medium">Priority: Medium</option>
                      <option value="Priority: Low">Priority: Low</option>
                  </select>   
                </td>
                <td>
                  {/* Service Team  */}
                  <textarea
                    className='inputStyle'
                    onChange={e => setFormData({ ...formData, 'serviceteam': e.target.value})}
                    placeholder="Service Team PFR/Roadmap"
                    value={formData.serviceteam}
                  />
                </td>
                <button className='addButton' onClick={() => createGobj()}>ADD</button>  
              </tr>
              ) : 
              (<a></a>) }

              {/* Mapping each of the gobjs */}
              {
                gobjs.map(gobj => (
                  <tr key={gobj.id}>
                    {(gobj.id == editing) ? 
                    (
                    <>
                      <td>
                        {/* Customer, SA, Gap input  */}
                        <textarea
                          className='inputStyle'
                          onChange={e => setFormData({ ...formData, 'ccustomer': e.target.value})}
                          placeholder={gobj.customer}
                          value={formData.ccustomer}
                        />
                      </td>
                      <td>
                        {/* Service  */}
                        <textarea
                          className='inputStyle'
                          onChange={e => setFormData({ ...formData, 'cservice': e.target.value})}
                          placeholder={gobj.service}
                          value={formData.cservice}
                        />
                      </td>
                      <td>
                        {/* Claim  */}
                        <textarea
                          className='inputStyle'
                          onChange={e => setFormData({ ...formData, 'cclaim': e.target.value})}
                          placeholder={gobj.claim}
                          value={formData.cclaim}
                        />        
                      </td>
                      <td>
                        {/* Win/Loss  */}
                        <textarea
                          className='inputStyle'
                          onChange={e => setFormData({ ...formData, 'cwinloss': e.target.value})}
                          placeholder={gobj.winloss}
                          value={formData.cwinloss}
                        />
                      </td>
                      <td>
                        {/* Priority  */}
                        <select name="priority" 
                                id="addPriority" 
                                required 
                                placeholder={gobj.priority}
                                onChange={(e) => setFormData({ ...formData, 'cpriority': e.target.value})}>
                            <option>Select Priority</option>
                            <option value="Priority: High">Priority: High</option>
                            <option value="Priority: Medium">Priority: Medium</option>
                            <option value="Priority: Low">Priority: Low</option>
                        </select>   
                      </td>
                      <td>
                        {/* Service Team  */}
                        <textarea
                          className='inputStyle'
                          onChange={e => setFormData({ ...formData, 'cserviceteam': e.target.value})}
                          placeholder={gobj.serviceteam}
                          value={formData.cserviceteam}
                        />
                      </td>
                      <button className='submitButton' onClick={() => editGobj(gobj)}>SUBMIT</button>  
                    </>
                    )
                    :
                    (
                    <>
                      <td>{gobj.customer}</td>
                      <td>{gobj.service}</td>
                      <td>{gobj.claim}</td>
                      <td>{gobj.winloss}</td>
                      <td>{gobj.priority}</td>
                      <td>{gobj.serviceteam}</td>
                      {/* <td>{gobj.user}</td> */}
                      <td><button className='editButton' onClick={() => editGobj(gobj)}>EDIT</button></td>
                      <td><button className='deleteButton' onClick={() => deleteGobj(gobj)}>DELETE</button></td>
                    </>
                    )}

                    </tr>
                ))
              }
            </tbody>
          </table>
        </>
      ) : (
        <div>
          
          <button 
            className='signinorout'
            onClick={() => Auth.federatedSignIn({customProvider: "AmazonFederate"})}>Signin With Midway</button>
          <h1>Dashboard</h1>
          <div style={{marginBottom: 30}}></div>
          <h3>Please sign in to view the dashboard...</h3>
        </div>
      )}


      {/* For Gobj */}
      
        {/* User  */}
        {/* <input
          onChange={e => setFormData({ ...formData, 'user': e.target.value})}
          placeholder="User"
          value={formData.user}
        /> */}
      
    </div>
  );
}

export default App;

import { useRef, useState } from 'react';
import './index.css';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App() {
  const [friends,setFriends]=useState(initialFriends)
  const [showAddFriend,setShowAddFriend]=useState(false)
  const [selectedFriend,setSelectedFriend]=useState(null)

  const handleBillSplit=(value)=>{
    console.log(value);
    setFriends(friends=> friends.map((f,i)=>{
      if(i==selectedFriend)return {...f,balance:(f.balance+value)}
      else return f
    }))

    setSelectedFriend(null)
  }


  return (
    <div className="app">
    <div className='sidebar'>

     <FriendsList friends={friends} selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend}/>
     {showAddFriend?<FormAddFriend  setFriends={setFriends}/>:<></>}
     <Button onClick={()=>setShowAddFriend(show=>!show)}>{showAddFriend?'close':'Add friend'}</Button>
    </div>

      {selectedFriend!==null && <FormSplitBill onBillSplit={handleBillSplit} friendName={friends[selectedFriend].name}   />}

    </div>
  );
}

function FriendsList({friends,selectedFriend,setSelectedFriend}){

  console.log(friends)
  return <ul>
    {
      friends.map((friend,index)=><Friend  selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend}  index={index} friend={friend} key={friend.id}/>)
    }</ul>
}

function Friend({friend,index,selectedFriend,setSelectedFriend}){

  return <li className={selectedFriend===index?'selected':''}>
    <img src={friend.image} alt={friend.name}/>
    <h3>{friend.name}</h3>
    {
      friend.balance<0 && (<p className='red'>You own ₹{Math.abs(friend.balance)}</p>)
    }
    {
      friend.balance>0 && (<p className='green'>{friend.name} own your ₹{friend.balance}</p>)
    }
    {
      friend.balance===0 && (<p>You and {friend.name} are even</p>)
    }

    <Button onClick={()=>setSelectedFriend((selected)=>selected===index?null:index)}>{selectedFriend===index?'close':'select'}</Button>
      
  </li>

}

function Button({children,onClick}){
  return <button className='button' onClick={onClick}>{children}</button>
}

function FormAddFriend({setFriends}){

  const nameRef=useRef()
  const imageRef=useRef()

  const addFriend=(e)=>{
    e.preventDefault()

    const name=nameRef.current.value
    const image=imageRef.current.value

    if(!name || !image)return

    const newFriend={
      id:crypto.randomUUID(),
      name,
      image:`${image}${crypto.randomUUID()}`,
      balance:0
    }
    
    setFriends(arr=>[...arr,newFriend])

    nameRef.current.value=""
    imageRef.current.value="https://i.pravatar.cc/48?="
  }
  return (
    <form className='form-add-friend'>
      <label>🙎 Friend name</label>
      <input type='text' ref={nameRef}/>

      <label>🌄 Image URL</label>
      <input type='text' ref={imageRef} defaultValue="https://i.pravatar.cc/48?="/>

      <Button onClick={(e)=>addFriend(e)}>Add</Button>
    </form>

  )
}

function FormSplitBill({friendName,onBillSplit}){



  const [bill,setBill]=useState('')
  const [paidByUser,setPaidByUser]=useState('')
  const [payingUser,setPayingUser]=useState("user")

  const paidByFriend=bill?bill-paidByUser:''

  const handleBillSubmit=(e)=>{
    e.preventDefault()

    if(!bill || !paidByUser)return
    onBillSplit(payingUser==='user'?paidByFriend:-paidByUser)


  }

  console.log(bill,paidByUser,payingUser)

  return <form className='form-split-bill' onSubmit={handleBillSubmit}>
      <h2>Split a bill with {friendName}</h2>

      <label>💲Bill value</label>
      <input type='text' value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

      <label>🧍Your Expense</label>
      <input type='text'  value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value))}/>

      <label>🙎 {friendName}'s expense</label>
      <input type='text'disabled value={paidByFriend}/>

      <label>💵 who is paying the bill?</label>
      <select value={payingUser}  onChange={(e)=>setPayingUser(e.target.value)}>
      <option value="user">you</option>
        <option value="friend">{friendName}</option>
        
      </select>

      <Button>Spilt bill</Button>
  </form>
}

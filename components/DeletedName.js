import axios from 'axios';
import { useEffect, useState } from 'react';
const LeaderBoard = (props) => {
    const [name2, setName2] = useState('');
    const [text,SetText]= useState('');
    const onChange = ({ target: { value } }) => {
        setName2(value);
        SetText(value);
    };
    const onEnter = async () => {
        console.log(text)
        console.log(name2)
        props.setBroadList([...res.data]);
        console.log(res.data);
    };
    useEffect(()=>{
        onEnter();
    },[])
    return (
        <div className='admin'>
            <div className='top2'>
                <p>Admin Delete User</p>
                <input className='input' value={text} onChange={onChange} />
                <button onClick={onEnter}>Delete</button>
            </div>
        </div>
    );
};
export default LeaderBoard;

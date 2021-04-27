import axios from 'axios';
import {useEffect,useState} from 'react';

const LeaderBoard = () => {
    const [boardList, setBroadList] = useState(['']);

    const fetchList = async () =>{
      const res = await axios.get('http://localhost:5000/api/list')
      setBroadList(res.data);
    }

    
    useEffect(()=>{
      fetchList()
    },[])
    return (
        <div className='leaderBoard'>
            <div className='top'>
                <p>Ranking</p>
                <p>LeaderBoard</p>
            </div>
            {boardList.map((list, index) => {
                return (
                    <div className='list' key={index}>
                        <p className='rank'>{index + 1}</p>
                        <p className='title'>
                            Name: {list.name}
                            <br />
                            Score: {list.score}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
export default LeaderBoard;

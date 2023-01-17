import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const effectRan = useRef(false);

    useEffect(() => {
        console.log('Users effect ran');
        //let isMounted = true;

        //const controller = new AbortController();

        if (effectRan.current === false) {
            const getUsers = async () => {
                try {
                    const response = await axiosPrivate.get('/users', {
                        //signal: controller.signal
                    });
                    console.log(response.data);
                    //isMounted && setUsers(response.data);
                    setUsers(response.data);
                } catch (err) {
                    console.error(err);
                    navigate('/login', { state: { from: location }, replace: true });
                }
            };

            getUsers();

            return () => {
                console.log('Users effect unmounted');
                //isMounted = false;
                effectRan.current = true;
                //controller.abort();
            };
        }
    }, []);

    return (
        <article>
            <h2>Users List</h2>
            {users?.length ? (
                <ul>
                    {users.map((user, i) => (
                        <li key={i}>{user?.username}</li>
                    ))}
                </ul>
            ) : (
                <p>No users to display</p>
            )}

            <br />
        </article>
    );
};

export default Users;

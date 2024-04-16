import React from 'react'
import Card from "../components/Cards";
import { AppBar, Toolbar, Box, Container, Typography, Button } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from "axios";


export default function Home() {

    const [loding, setLoading] = useState(false)

    const notify = () => toast("Deleted!");

    useEffect(() => {
    getUsers();
    }, []);

    const [users, setUsers] = useState(() => {
    const data = localStorage.getItem("userDetail");
    if (data) {
        return JSON.parse(data);
    } else {
        return [];
    }
    });

    useEffect(() => {
    if (users.length != 0) {
        localStorage.setItem("UserDetails", JSON.stringify(users));
    }
    }, [users]);

    const getAllData = useCallback(async () => {
    let { data } = await Axios.get('https://randomuser.me/api/?results=50');
    return data.results;
    }, []);


    const getUsers = useCallback(async () => {
    setLoading(true);
    try {
        let result = await getAllData();
        let data = localStorage.getItem("UserDetails");
        if (!data) {
        setUsers(result);
        } else {
        const localData = JSON.parse(data);
        setUsers(localData);
        }
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
    }, [getAllData]);



    const deleteUser = (id: string) => {
    const data = localStorage.getItem("UserDetails");
    if (data) {
        const localData = JSON.parse(data);
        let filteredArray = localData.filter((obj: any) => obj.email !== id);
        notify()
        setUsers(filteredArray);
    }
    };

    const refreshUser = async () => {
    let result = await getAllData();
    setUsers(result);
    };




    return (
        <Box>

            {
            loding && <Box sx={{ display: 'flex', position: 'fixed', bottom: '45%', left: '45%' }}>
                <CircularProgress />
            </Box>
            }

            <AppBar position="relative" sx={{ backgroundColor:"#FFFFFFA7"}} >
                <Toolbar >
                    <Container sx={{ display:{sm: 'flex'}, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{color:"#626262"}}>Total Users
                        <Box component="span" sx={{ml:1 ,color:"#f44336" ,fontWeight:'600'}}>{users.length}</Box>
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => refreshUser()}>Refresh</Button>
                    </Container>
                </Toolbar>
            </AppBar>
            
        
            <Container>

            <Box sx={{
                mt:"10px", display: 'grid', gap: 4, gridTemplateColumns: {md:'repeat(3, 1fr)',lg:'repeat(5, 1fr)',xs:'repeat(1, 1fr)' ,sm:'repeat(2, 1fr)'}
            }}>
                {
                users && users?.map((item: any, index: any) => {
                    return (
                    <Card key={index} user={item} delet={deleteUser} />
                    )
                })
                }
            </Box >
            </Container>



            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </Box>
    )
}

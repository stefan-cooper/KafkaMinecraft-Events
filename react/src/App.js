import { useEffect, useState } from 'react'

import './App.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import addNotification, { Notifications } from 'react-push-notification'

const App = () => {

  const [notificationSet, updateNotificationSet] = useState(new Set())
  const [notifiedSet, updateNotifiedSet] = useState(new Set())

  useEffect(() => {
    setInterval(() => {
      getNotifications()
    }, 2500)
  }, [])

  useEffect(() => {
    notificationSet.forEach(notification => {
      if (!notifiedSet.has(notification)) {
        notifiedSet.add(notification)
        updateNotifiedSet(notifiedSet)
        toast(notification, {
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: notification
        })

        renderNotification(notification)
      }
    })
  }, [notificationSet])

  const getNotifications = () => {

    const updateNotifs = (notifs) => {
      let newNotifs = new Set(notificationSet)
      notifs.forEach(notif => newNotifs.add(notif))
      updateNotificationSet(newNotifs)
    }

    const timeCheck = new Date().getTime() - 5000

    axios.get(`http://localhost:3001/api/kafka_motion?time=${timeCheck}`).then(res => {
      if (res && res.data) updateNotifs(res.data)
    })
    axios.get(`http://localhost:3001/api/kafka_login?time=${timeCheck}`).then(res => {
      if (res && res.data) updateNotifs(res.data)
    })
    axios.get(`http://localhost:3001/api/kafka_ring?time=${timeCheck}`).then(res => {
      if (res && res.data) updateNotifs(res.data)
    })
  }

  const renderNotification = (notif) => {
    addNotification({
      native: true,
      title: notif
    })
  }

  return (
    <>
    <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
    <Notifications />
    <div className="App">
      <header className="App-header">
        <p onClick={() => renderNotification('test')}>
          Kafka Minecraft Events
        </p>
      </header>
    </div>
    </>
  );
}

export default App;

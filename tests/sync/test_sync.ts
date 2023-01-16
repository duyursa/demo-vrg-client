import { Client, Room } from 'colyseus.js'
import { generateId } from '@mirabo-tech/colyseus_core'
import { VRGRoomState } from './client-side/VRGRoomState'

const client = new Client("ws://localhost:2567");

client
  .joinOrCreate('chat', {
    username: 'username_here',
  })
  .then(_room => {
    const room = <Room>_room
    room.onError(message => {
      console.log('ERROR', message)
    })

    room.onMessage('LIST_ONLINE_USER', message => {
      console.log('<== LIST_ONLINE_USER', message)
    })

    room.onMessage('TEXT_MESSAGE', message => {
      console.log('TEXT_MESSAGE', message)
    })

    room.onMessage('CLIENT_JOINED', message => {
      console.log('CLIENT_JOINED', message)
    })

    room.onMessage('CLIENT_LEAVE', message => {
      console.log('CLIENT_LEAVE', message)
    })

    room.onMessage('MESSAGE_SEND_FAIL', message => {
      console.log('MESSAGE_SEND_FAIL', message)
    })

    room.onMessage('MESSAGE_SEND_SUCCESS', message => {
      console.log('MESSAGE_SEND_SUCCESS', message)
    })

    setInterval(() => {
      console.log('==> GET_LIST_ONLINE_USER')
      room.send('GET_LIST_ONLINE_USER')
      room.send('SEND_TEXT_MESSAGE', {
        id: '123123',
        toUser: 'phuclm',
        message: 'hi',
      })

      room.send('SEND_TEXT_MESSAGE', {
        id: '123123',
        toUser: 'username_here',
        message: 'hi',
      })
    }, 3000)
  })
  .catch(e => {
    console.error('join error', e)
  })

client
  .joinOrCreate('csa', {
    username: 'phuclm',
    userData: 'userDatahere',
  })
  .then(_room => {
    const room = <Room<VRGRoomState>>_room
    room.onError(message => {
      console.log('ERROR', message)
    })

    room.onMessage('SET_VISITOR_USERDATA_ERROR', message => {
      console.log('message', message)
    })

    room.state.visitors.onAdd = (visitor, key) => {
      console.log(visitor, 'has been added at', key)
      visitor.onChange = function (changes) {
        changes.forEach(({ field, value, previousValue }) => {
          console.log('visitorDatachange', { field, value, previousValue })
        })
      }

      // force "onChange" to be called immediatelly
      visitor.triggerAll()
    }

    setInterval(() => {
      const message = `${new Date().getTime()}`
      console.log('SET_VISITOR_USERDATA', message)
      room.send('SET_VISITOR_USERDATA', message)
    }, 3000)
  })
  .catch(e => {
    console.error('join error', e)
  })

async function getAvailableRooms(roomName: string) {
  return await client.getAvailableRooms(roomName)
}

async function joinById(id: string) {
  // const room = await client.joinById(id, { access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMyLCJ1c2VySWQiOiJ0ZXN0dXNlcl8xIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcl8xIiwiZW1haWwiOiJhcnR3b3JsZHZyQGdtYWlsLmNvbSIsInRpZCI6IiQyYiQxMCQ5bVphc2h2OXRJTFZXdW5oWFV1REJPUURpU05vSW8ub3hRY0FyeTJldzZSdDA0a0JMM0FXTyIsImlhdCI6MTYzODQ2Njk3NiwiZXhwIjoxNjM4NTUzMzc2fQ.YLOG1-qGjt3JanaMrMSQAbBO6K1LxuzA4H6sfAk9cU8" });
  // const room = await client.joinById(id, { access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMzLCJ1c2VySWQiOiJ0ZXN0dXNlcl8yIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcl8yIiwiZW1haWwiOiJhcnR3b3JsZHZyQGdtYWlsLmNvbSIsInRpZCI6IiQyYiQxMCQ3RDc1azdhclc3MFMxbEVHLzdlamJPY3VZbTZqd2s1dGxCckV0cEpTdDFDYnJGU2pDdnZPaSIsImlhdCI6MTYzODQ2NzAwMywiZXhwIjoxNjM4NTUzNDAzfQ.X2Vk4fTxiSpsXvYcCxITA_Gd71jxY9TU-jIApgaRh_A" });
  // const room = await client.joinById(id, { access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMzLCJ1c2VySWQiOiJ0ZXN0dXNlcl8yIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcl8yIiwiZW1haWwiOiJhcnR3b3JsZHZyQGdtYWlsLmNvbSIsInRpZCI6IiQyYiQxMCRESHEwOFFNZFVOYzZ3WEdDR0hUNzNPUEpMTWFCVWZLOWt3d0hBTFh3MDNxWWU3VnB3cXRQUyIsImlhdCI6MTYzOTA0OTE2NywiZXhwIjoxNjM5MTM1NTY3fQ.L7BvlLUXRzesl3hqKawAsbHpCSsmYEWGoj6b6QSHDP4" });
  const room = <Room<VRGRoomState>>await client.joinById(id)
  room.onLeave(() => console.log('left matchmaking'))

  // room.onStateChange((state) => {
  //   console.log("\non state <==========", JSON.stringify(state));
  // });
  room.onMessage('dedicated_addr', message => {
    console.log('message', message)
  })

  room.state.entities.onAdd = (entity, key) => {
    console.log(entity, 'has been added at', key)
    entity.onChange = function (changes) {
      changes.forEach(change => {
        console.log('field', change.field)
        console.log('value', change.value)
        console.log('previousValue', change.previousValue)
      })
    }

    // force "onChange" to be called immediatelly
    entity.triggerAll()
  }

  setInterval(() => {
    console.log('\nadd entity to server ==========>')
    const entityId = generateId()
    const attributes = {}
    attributes[generateId()] = {
      dataType: generateId(),
      dataValue: generateId(),
    }
    room.send('CREATE_ENTITY', {
      id: generateId(),
      type: 'video',
      attributes,
    })

    setInterval(() => {
      const attributes = {}
      attributes[generateId()] = {
        dataType: 'update_' + generateId(),
        dataValue: 'update_' + generateId(),
      }
      console.log('\nupdate entity to server ==========>', entityId)
      room.send('UPDATE_ENTITY', {
        id: entityId,
        type: 'video',
        attributes,
      })

      setInterval(() => {
        console.log('\ndelete entity ==========>', entityId)
        room.send('REMOVE_ENTITY', { id: entityId })
      }, 2000)
    }, 3000)
  }, 1000)

  return room
}

async function timeout(ms: number = 50) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// const roomId = process.env.ROOMID;
// (async () => {
//   await joinById(roomId);
//   return;
// })();

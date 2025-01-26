export async function getPlayers(game) {
  try {
    const gameName = game
    const res = await fetch("/api/get-players?" + new URLSearchParams({game:gameName}).toString(), {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })

    if (!res.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred');
    }
    const players = await res.json()
    const playerNames = players.map((obj) => obj.player)
    return playerNames
  } 
  catch (err) {
    console.error(`FETCH ERROR: ${err}`)
    return undefined
  }
  }

export function handleAddPlayer(playerObj) {
    console.log('playerObj to add is ',playerObj)
    const response = fetch("/api/add-player", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: playerObj,
    })
  }

export async function getMatches(game) {
  const matches = await fetch("/api/get-matches?" + new URLSearchParams({game:game}).toString(), {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  }).then(res => res.json())
    //.then(matchesObj => matchesObj.map((obj) => obj.player)
  console.log('matches is loaded as ',matches);
  return matches;
}

export async function getMatchById(matchid) {
  const query = JSON.stringify({'_id': matchid })
  console.log('calling api with querty',query)
  const matches = await fetch("/api/get-match", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: query
  }).then(res => res.json())
  console.log('match returned by query is',matches);
  return matches;
}

export async function deleteMatch(match) {
  const res = await fetch("/api/delete-match", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
    body: JSON.stringify({_id:match._id})
  }).then(res => res.json())
  console.log('Result of deletion: ',res);
  return res;
}

export async function updateMatch(match) {
  try {

    const res = await fetch("/api/update-match", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'_id':match._id})
    }).then(res => res.json())
    console.log('Result of updated match: ',res);
    if (!res.ok) {
      throw new Error(`HTTP error: Status ${res.status}`)
    }
    return res;
  } catch (err) {
    console.error('Failed when calling API to update match: ',err)
  }
}
// NOTE: Remember to handle draws, and 0-0 matches

// Input: matches, an array of match objects
//        players, an array of strings (player names)
export default function CalculateElo(matches, players) {
    console.log('..... calc elo')
    tests()
    const playerRankObj = players.reduce((acc,curr) => (acc[curr] = 1000, acc),{})
    matches.forEach((match) => {
        try {
            if (!checkPlayersAllCorrect(match.team1,match.team2,players)) {
                throw new Error(`All players in ${match._id} were not in the players db.`)
            }

            const score1 = Number(match.team1score)
            const score2 = Number(match.team2score)

            if (match.matchType === '1v1') {
                const pl1 = match.team1
                const pl2 = match.team2
                console.log('Sanity check in elo: ', pl1, pl2,score1,score2,playerRankObj[pl1],playerRankObj[pl2])
                const newRank1 = UpdatedRank(playerRankObj[match.team1],playerRankObj[match.team2],score1,score2)
                const newRank2 = UpdatedRank(playerRankObj[match.team2],playerRankObj[match.team1],score2,score1)
                playerRankObj[pl1] = newRank1;
                playerRankObj[pl2] = newRank2;
                console.log('Player ranks after update 1v1: ',playerRankObj) 
            } else if (match.matchType === '2v2') {
                const pl1 = match.team1[0]
                const pl2 = match.team1[1]
                const pl3 = match.team2[0]
                const pl4 = match.team2[1]
                const pl1Rank = playerRankObj[pl1]
                const pl2Rank = playerRankObj[pl2]
                const pl3Rank = playerRankObj[pl3]
                const pl4Rank = playerRankObj[pl4]
                playerRankObj[pl1] = UpdatedRank2v2(pl1Rank,pl2Rank,pl3Rank,pl4Rank,score1,score2)
                playerRankObj[pl2] = UpdatedRank2v2(pl2Rank,pl1Rank,pl3Rank,pl4Rank,score1,score2)
                playerRankObj[pl3] = UpdatedRank2v2(pl3Rank,pl4Rank,pl1Rank,pl2Rank,score2,score1)
                playerRankObj[pl4] = UpdatedRank2v2(pl4Rank,pl3Rank,pl1Rank,pl2Rank,score2,score1)
                console.log('Player ranks after update 2v2: ',playerRankObj) 
            }
            console.log('Still all good')
            return;
        } catch (e) {
            console.log('Error when processing match ', e, match)
        }
    })
    return playerRankObj
}

const checkPlayersAllCorrect = (team1, team2, allPlayers) => {
    const participants = [team1,team2].flat()
    return participants.every((player) => allPlayers.includes(player))
}

const adj = 400
const KFactor = 32

const scoreMargin = (Sa, Sb) => {
    if (Sa === Sb) {
        return 1
    } else {
        const diff = Math.abs(Sa-Sb)
        const max = Math.max(Sa,Sb)
        return Math.log(100 * diff / max)
    }
}

const ExpProbOfVictory = (playerRank, oppRank) => {
    return (1 / (1 + 10 ** ((oppRank - playerRank) / 400)))
}

const UpdatedRank = (playerRank, oppRank, Sa, Sb) => {
    const aWonIndicator = (Sa > Sb) ? 1 : (Sa === Sb) ? 0.5 : 0
    const diff = (aWonIndicator - ExpProbOfVictory(playerRank, oppRank))
    return playerRank + KFactor * scoreMargin(Sa,Sb) * diff
}

const UpdatedRank2v2 = (p1Rank, p2Rank, p3Rank, p4Rank, Sa, Sb) => {
    const t1Rank = 0.5 * (p1Rank + p2Rank)
    const t2Rank = 0.5 * (p3Rank + p4Rank)
    const aWonIndicator = (Sa > Sb) ? 1 : (Sa === Sb) ? 0.5 : 0
    const diff = (aWonIndicator - ExpProbOfVictory(t1Rank, t2Rank))
    return p1Rank + KFactor * scoreMargin(Sa,Sb) * diff
}


const tests = () => {
    console.log('Testing prob of victory..')
    console.log(ExpProbOfVictory(100,200),ExpProbOfVictory(200,100))
    console.log(ExpProbOfVictory(1,200),ExpProbOfVictory(200,1))
    console.log(ExpProbOfVictory(10000,9999),ExpProbOfVictory(9999,10000))
}
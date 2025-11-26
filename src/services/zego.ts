const yourAppID = 1184811620;
const yourAppSign = "4e5d981a0cb8493a35939b852c3dd04e6c4b565b2282945b84078a9e1f116074";

const engine = await ZegoExpressEngine.createEngine(yourAppID, yourAppSign, false, ZegoScenario.General);
await engine.loginRoom(roomID, {user.userID, user.userName}, config);
await engine.startPublishingStream(streamID, ZegoPublishChannel.Main, config);
await engine.startPlayingStream(streamID, new ZegoView(reactTag, viewMode, backgroundColor), config);
await engine.logoutRoom(roomID);
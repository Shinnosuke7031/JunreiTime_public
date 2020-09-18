function initMap() {
  // 中心地点(緯度,経度)の設定(緯度経度は世界測地系の度数表示)
  var tocho = new navitime.geo.LatLng('35.689614', '139.691634');
  var shin_okubo = new navitime.geo.LatLng('35.701429', '139.700003');
  // ナビタイム独自の記法（https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/latlng.html#id2）
  center = new navitime.geo.LatLng('35.667395', '139.714896');
  // 地図を描画・制御する要素(オブジェクト)を作成(引数は, [地図を表示するためのDivId, 中心緯度経度, ズーム値])
  // ナビタイム独自の記法（https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/map.html）
  map = new navitime.geo.Map('map', tocho, 15);
  
  var infoWindow = new navitime.geo.overlay.InfoWindow({
    map: map,                                              // 表示対象地図インスタンス(setMapメソッドでも可)
    position: center,                                      // 緯度経度
    content: "東京駅",                                     // 内部に表示させる内容
    pixelOffset: {x: 0, y: -30},                           // x: 表示位置X →方向 ＋, y: 表示位置Y ↓方向 ＋
    zIndex: 100,                                           // その他のオーバーレイと比較したzIndex
    maxWidth: 150,                                         //　吹き出しの最大幅  
    closeButtonDisplay:  navitime.geo.DisplayType.ALWAYS   // クローズボタンの表示種別
  });

  //動くピン
draggablePin = new navitime.geo.overlay.Pin({
  icon:'pin.png',
  position:tocho,
  draggable:true,
  map:map,
  title:'東京都庁'
});

//動かないピン
var staticPin = new navitime.geo.overlay.Pin({
  icon:'pin.png',
  position:shin_okubo,
  draggable:true,
  map:map,
  title:'新大久保'
});

document.getElementById('mapdiv').style.display=('none');
}

//ピンの切り替え
function switchPin() {
draggablePin.setVisible(!draggablePin.getVisible());
}
// HTMLの読み込みが完了してから, initMap関数を実行(scriptタグの読み込みが完了した状態で実行するために必要)
  window.onload = initMap;

function search() {
    // ルート線を取得するためのurlを定義
    let url = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamb/v1/shape_transit?start=35.658584,139.745457&goal=35.667395,139.714896&start_time=2020-09-04T09:00:00&options=transport_shape&order=fare';
    axios
        .get(url)　 // ルート線を取得
        .then(connectSuccessRouteShape) // ルート線が取得できた場合　connectSuccessRouteShapeメソッドの呼び出し
        .catch(connectFailure) // ルート線が取得できなかった場合　connectFailureメソッドの呼び出し
}

function connectSuccessRouteShape(response) {
  // 変数（route）に取得したAPIのレスポンスを格納
  route = response.data;

  // ルートを描画するためのGeoJSON形式の要素（オブジェクト）を生成し、変数rendererとして定義
  // ナビタイム独自の記法(https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/jsdoc/symbols/navitime.geo.route.Renderer.html) 
  renderer = new navitime.geo.route.Renderer(route, {
      map: map,
      unit: 'degree',
      allRoute: true,     // すべてのルートを表示するか
      arrow: true,     // ルート線上に進行方向の矢印を表示するか
      originalColor: true,     // 路線形状に指定された元々の色を利用するか
  });
  // ルートを描画
  // ナビタイム独自の記法(https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/jsdoc/symbols/navitime.geo.route.Renderer.html) 
  renderer.draw();
}

function connectFailure(error) {
    alert(error);
}



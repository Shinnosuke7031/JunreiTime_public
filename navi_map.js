function initMap(lat, lon, zoom) {
  // 中心地点(緯度,経度)の設定(緯度経度は世界測地系の度数表示)
  // ナビタイム独自の記法（https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/latlng.html#id2）
  center = new navitime.geo.LatLng(lat, lon);
  // 地図を描画・制御する要素(オブジェクト)を作成(引数は, [地図を表示するためのDivId, 中心緯度経度, ズーム値])
  // ナビタイム独自の記法（https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/map.html）
  map = new navitime.geo.Map('map', center, zoom);
  
  if (zoom !== 8) {
    var infoWindow = new navitime.geo.overlay.InfoWindow({
      map: map,                                              // 表示対象地図インスタンス(setMapメソッドでも可)
      position: center,                                      // 緯度経度
      content: '<p class=info>スタート</p>',                                     // 内部に表示させる内容
      pixelOffset: {x: 0, y: -30},                           // x: 表示位置X →方向 ＋, y: 表示位置Y ↓方向 ＋
      zIndex: 100,                                           // その他のオーバーレイと比較したzIndex
      maxWidth: 500,                                         //　吹き出しの最大幅  
      closeButtonDisplay:  navitime.geo.DisplayType.ALWAYS   // クローズボタンの表示種別
    });
  }

}

function search(lat, lon) {
  const start_lat = document.getElementById("a").value;
  const start_lon = document.getElementById("b").value;

    // ルート線を取得するためのurlを定義
    //let url = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamb/v1/shape_transit?start=35.658584,139.745457&goal=35.667395,139.714896&start_time=2020-09-04T09:00:00&options=transport_shape&order=fare';
    let url = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamb/v1/shape_transit?start=' + start_lat + ',' + start_lon + '&goal=' + lat + ',' + lon + '&start_time=2020-09-04T09:00:00&options=transport_shape&order=fare';
    axios
        .get(url)　 // ルート線を取得
        .then(connectSuccessRouteShape) // ルート線が取得できた場合　connectSuccessRouteShapeメソッドの呼び出し
        .catch(connectFailure) // ルート線が取得できなかった場合　connectFailureメソッドの呼び出し
}

function connectSuccessRouteShape(response) {
  route = response.data;

  renderer = new navitime.geo.route.Renderer(route, {
      map: map,
      unit: 'degree',
      allRoute: true,     // すべてのルートを表示するか
      arrow: true,     // ルート線上に進行方向の矢印を表示するか
      originalColor: true,     // 路線形状に指定された元々の色を利用するか
  });

  renderer.draw();
}

function connectFailure(error) {
    alert(error);
}

//ここでマップの初期化などをやる
document.getElementById("pin").onclick = function() {
  const pin_lat = document.getElementById("a").value;
  const pin_lon = document.getElementById("b").value;
  initMap(pin_lat, pin_lon, 14);
  //console.log(pin_lat);
  //console.log(pin_lon);
  const pinposi = new navitime.geo.LatLng(pin_lat, pin_lon);

  draggablePin = new navitime.geo.overlay.Pin({
    icon:'pin.png',
    position:pinposi,
    draggable:false,
    map:map,
    title:'スタート'
  });

};

//ここでマップの初期化などをやる(キーワード検索用)
document.getElementById("pin_keyword").onclick = function() {
  const pin_lat = document.getElementById("a").value;
  const pin_lon = document.getElementById("b").value;
  initMap(pin_lat, pin_lon, 8);

  const pinposi = new navitime.geo.LatLng(pin_lat, pin_lon);
  
  /*draggablePin = new navitime.geo.overlay.Pin({
    icon:'pin.png',
    position:pinposi,
    draggable:false,
    map:map,
    title:'スタート'
  });*/
  
};

document.getElementById("pin_search").onclick = function() {
  const pin_lat = document.getElementById("pin_lat").value;
  const pin_lon = document.getElementById("pin_lon").value;
  const pin_title = document.getElementById("pin_title").value;
  //console.log(pin_lat);
  //console.log(pin_lon);
  
  const pinposi = new navitime.geo.LatLng(pin_lat, pin_lon);

  draggablePin = new navitime.geo.overlay.Pin({
    icon:'pin_red.png',
    position:pinposi,
    draggable:false,
    map:map,
    title:pin_title
  });

};

let count = 0;
document.getElementById("pin_search_keyword").onclick = function() {
  const pin_lat = document.getElementById("pin_lat_keyword").value;
  const pin_lon = document.getElementById("pin_lon_keyword").value;
  const pin_title = document.getElementById("pin_title_keyword").value;
  //console.log(pin_lat);
  //console.log(pin_lon);
  
  const pinposi = new navitime.geo.LatLng(pin_lat, pin_lon);

  draggablePin = new navitime.geo.overlay.Pin({
    icon:'pin_red.png',
    position:pinposi,
    draggable:false,
    map:map,
    title:pin_title
  });

  if (count === 0) moveTo(pinposi, 8);
  count++;
};

document.getElementById('getRoute').onclick = function() {
  const pin_lat = document.getElementById(`lat_id_${this.value}`).value;
  const pin_lon = document.getElementById(`lon_id_${this.value}`).value;
  search(pin_lat, pin_lon);
}

document.getElementById('go_to_seichi').onclick = function() {
  console.log('click go_to_seichi');
  const pin_lat = document.getElementById('go_to_seichi_lat').value;
  const pin_lon = document.getElementById('go_to_seichi_lon').value;
  const pin_title = document.getElementById('go_to_seichi_title').value;
  console.log(pin_lat)
  console.log(pin_lon)
  console.log(pin_title)


  const pinposi = new navitime.geo.LatLng(pin_lat, pin_lon);

  map.moveTo(pinposi, 15);

  var SeichiinfoWindow = new navitime.geo.overlay.InfoWindow({
    map: map,                                              // 表示対象地図インスタンス(setMapメソッドでも可)
    position: pinposi,                                      // 緯度経度
    content: `<p class=info>${pin_title}</p>`,             // 内部に表示させる内容
    pixelOffset: {x: 0, y: -30},                           // x: 表示位置X →方向 ＋, y: 表示位置Y ↓方向 ＋
    zIndex: 101,                                           // その他のオーバーレイと比較したzIndex
    maxWidth: 500,                                         //　吹き出しの最大幅  
    closeButtonDisplay:  navitime.geo.DisplayType.ALWAYS   // クローズボタンの表示種別
  });

}

document.getElementById('keyword_move').onclick = function() {
  const lat = document.getElementById('move_lat').value;
  const lon = document.getElementById('move_lon').value;
  const pinposi = new navitime.geo.LatLng(lat, lon);
  map.moveTo(pinposi, 8);
}

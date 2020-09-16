function initMap() {
  // 中心地点(緯度,経度)の設定(緯度経度は世界測地系の度数表示)
  // ナビタイム独自の記法（https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/latlng.html#id2）
  center = new navitime.geo.LatLng('35.667395', '139.714896');
  // 地図を描画・制御する要素(オブジェクト)を作成(引数は, [地図を表示するためのDivId, 中心緯度経度, ズーム値])
  // ナビタイム独自の記法（https://api-sdk.navitime.co.jp/api/specs/tilescript_tutorial/map.html）
  map = new navitime.geo.Map('map', center, 15);

  document.getElementById("mapdiv").style.display = "none";
}

window.onload = initMap;

function search() {

  // ルート線を取得するためのurlを定義
  let url = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamb/v1/shape_transit?start=35.658584,139.745457&goal=35.667395,139.714896&start_time=2020-09-04T09:00:00&options=transport_shape&order=fare';
  axios
      .get(url)　 // ルート線を取得
      .then(connectSuccessRouteShape) // ルート線が取得できた場合　connectSuccessRouteShapeメソッドの呼び出し
      .catch(connectFailure) // ルート線が取得できなかった場合　connectFailureメソッドの呼び出し
  
  map.resizeTo();
}

function connectSuccessRouteShape(response) {
  // 変数（route）に取得したAPIのレスポンスを格納
  route = response.data;
  console.log(route);

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

let count = 0;
//document.getElementById("mapdiv").style.display = "display";
/*function clickBtn(){
  const p1 = document.getElementById("mapdiv");
  const btn = document.getElementById("map_btn");

	if(p1.style.display=="block"){
		// noneで非表示
    //p1.style.display ="none";
    btn.textContent = "MAP表示";
	}else{
		// blockで表示
    //p1.style.display ="block";
    btn.textContent = "MAP非表示";
    if (count === 0) initMap();
    count++;
	}
}*/

//const btn = document.getElementById("map_btn");
/*const p1 = document.getElementById("mapdiv");
if(p1.style.display=="block"){
  //btn.textContent = "MAP表示";
}else{
  //btn.textContent = "MAP非表示";
  console.log("koko");
  if (count === 0) initMap();
  count++;
}*/


//变量区域,jquer变量前面加$符号是为了区分是原生DOM 还是jQuery
var $container = $(".box-container");
//页面渲染区域
var list = [];
var cookie = null;
//加载数据
$.ajax("https://list.mogujie.com/search",{
    dataType:"jsonp"
})
.then(render)
function render(res){
    list = res.result.wall.list;
    // console.log(list)
    //利用插件template进行页面渲染
    var html = template("box-item",{list:list});
    $container.html(html);
}

//购物车逻辑
//当一个商品点击加入购物车之后，我把商品的数据存入到cookie之中这个时候我们也就算是成功加入了购物车；
//利用事件委托给父级绑定一个事件
$container.on("click","button",addCart);
function addCart(evt){
    var e = evt || window.event;
    var target = e.target || e.scrElement;
    //获取索引下标的值；
    var index = $(target).attr("data-index");
    //console.log(index);
    //利用商品下标在商品列表list之中获取到了对应的商品数据；
    // console.log(index,list[index]);
    //把商品的iid放入cookie之中
    var iid =list[index].iid;

    //1.判定当前页面是否存在 carts cookie;
    if(cookie = $.cookie("carts")){
        //因为cookie之中存的是纯字符串，所以要转换成数组；
        var cartsList = JSON.parse(cookie);
        //我要判定当前的id 是否已经存在于cartsList之中，
        //如果已经存在那么我就让num属性自增；
        //如不存在就再创建一个新的结构；

        var hasSameId = cartsList.some(function(item,index){
            //如果id相同数量自增；
            if(item.id === iid){
                item.num ++;
            }
            return item.id === iid ;
        })

        //如果没有相同 id ,创建新数据；
        if(!hasSameId){
            var item = {
                "id" : iid,
                "num":  1
            }
       
            cartsList.push(item);
        }
        $.cookie("carts",JSON.stringify(cartsList));
    }else{
        //建立初始结构；
        var cartsList = [
            {
                "id" : iid,
                "num": 1
            }
        ]
        $.cookie("carts",JSON.stringify(cartsList));
    }
    // console.log($.cookie("carts"));
    //在页面中更改购物车的数量
    $("#showNum").html(getCarNum())
}

    function getCarNum(){
        if(!$.cookie("carts")){return 0};
        var cartsList = JSON.parse($.cookie("carts"));

        var count = 0;
        for(var i = 0 ; i < cartsList.length ; i ++){
            count += Number(cartsList[i].num);
        }
        return count ;
    }

    //清空购物车
    $("#showNum").html(getCarNum());
    $(".show").on("click",clearCarts);
    function clearCarts(){
        var bool = confirm("是否清空购物车");
        if(bool){
            //清空覆盖原来的数据
            $.cookie("carts","");
            //重新更新页面数据
            $("#showNum").html(getCarNum());
        }
    }

    //页面跳转
    $("#jiesuan").on("click",tiaozhuan)
    function tiaozhuan(){
        location.href = "showCart.html";
    }
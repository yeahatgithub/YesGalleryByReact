require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//import ReactAddons from 'react/addons';
import { findDOMNode } from 'react-dom';

var IMAGE_WIDTH = 320;    //240px, height = width
//获取图片元数据
var imageInfoList = require('../data/imgDescInfo.json');
//生成图片的url和位置
imageInfoList = (function (imageInfoArr){
    imageInfoArr.forEach(function(element) {
      element.imageUrl = require('../images/' + element.fileName);
      element.position = {left: 0, top: 0};
      element.rotate = 0;   //旋转角度
      element.isFlipped = false;  //是否翻到背面了？
    }, this);

    return imageInfoArr;
}(imageInfoList));

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.state ={figureInfo: props.imgInfo };
  }
  flip() {
    var figInfo = this.state.figureInfo;
    figInfo.isFlipped = !figInfo.isFlipped;
    this.setState({
      figureInfo: figInfo
    })
  }

  render() {
    var styleValue = this.props.imgInfo.position;
    //旋转html元素的css写法： transform: rotate(20deg);
    //这里，通过style属性来设置旋转
    //为兼容老版本的浏览器，启用了-ms-transform, -webkit-transform, -moz-transform等属性，属性值都是rotate(??deg)
/*     ["-ms-", "-webkit-", "-moz-", ""].forEach(function(preStr){
      styleValue[preStr + "transform"] =  "rotate(" + this.props.imgInfo.rotate + "deg)";
    }, this);  */
    if (this.props.imgInfo.rotate)
      styleValue["transform"] = 'rotate(' + this.props.imgInfo.rotate + 'deg)';
    //style属性值包含transform子属性的话，css文件中针对同一元素的transform设定将被覆盖。

    //var figureClassName = "img-figure is-flipped";  //测试App.scss中实现的图片翻转效果是否出得来。测试成功。
    var figureClassName = 'img-figure';
    if (this.props.imgInfo.isFlipped) {
      figureClassName += ' ' + 'is-flipped';
    } 
    
    return (
            /* .img-figure样式设定position=absolute，才能使得style属性中的left, top起效 */
      <figure className={figureClassName} style={styleValue} onClick={this.flip.bind(this)}>
        <img src={this.props.imgInfo.imageUrl} alt={this.props.imgInfo.title} />
        <figcaption>
          <h2 className="img-title">{this.props.imgInfo.title}</h2>
          <div className="img-back">
            <p>{this.props.imgInfo.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imagesInfo: imageInfoList};   //用(class...extends...)定义组件时，这是定义组件状态变量的写法。
  }

/*   getInitialState() {    //用React.createClass定义组件时，用getInitialState定义组件状态变量
    return {imagesInfo: imageInfoList};
  } */

  render() {
    var controllerUnits = [];
    var imgFigures = [];
    //var stage = React.findDOMNode('.stage');    //此时，组件还未加载到网页上。是无法调用findDOMNode取到dom节点的。
    
    //console.log('AppComponent.render(), imageInfoList=', imageInfoList);
    imageInfoList.forEach(function(singleImageInfo, index){
      //singleImageInfo.left = index * 10;   /* 要使left, top属性起效，需要把position设定为absolute  */
      //singleImageInfo.top = index * 10;
      //singleImageInfo.position = calcRandomPosition(0, 0, stage.width, stage.height);   //需要在componentDidMount生命周期函数内来计算图片的位置
      //singleImageInfo.position = {left: 0, top: 0};
      imgFigures.push(<ImgFigure imgInfo={singleImageInfo} key={index}/>);
    }, this);


    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }

  componentDidMount() {
    var stageDomNode = findDOMNode(this.refs.stage);

    var stageWidth = stageDomNode.scrollWidth;
    var stageHeight = stageDomNode.scrollHeight;
    //console.log('AppComponent.componentDidMount(), (stageWidth, stageHeight)=', stageWidth, stageHeight);

    this.arrangeImages(0, 0, stageWidth, stageHeight);
  }

  arrangeImages(x_low, y_low, x_high, y_high) {
/*     imageInfoList.forEach(function(singleImageInfo, index){
      singleImageInfo.position = this.calcRandomPosition(x_low, y_low, x_high, y_high);
      //imageInfoList[index].position = this.calcRandomPosition(x_low, y_low, x_high, y_high);
    }, this); */
    this.setImagesPostion(x_low, y_low, x_high, y_high, 8);    
    //console.log('AppComponent.arrangeImages(), imageInfoList=', imageInfoList);
    this.setState({
      imagesInfo: imageInfoList
    });
  }

  //设定所有图片的坐标位置
  // @param center_img_index: 处于中心位置的图片的下标（数组中的下标）
  setImagesPostion(x_low, y_low, x_high, y_high, center_img_index) {
    var halfImageWidth = Math.floor(IMAGE_WIDTH / 2);
    //中心点
    var center_x = Math.floor(x_low + (x_high - x_low) / 2);
    var center_y = Math.floor(y_low + (y_high - y_low) / 2);

    //左侧区域
    var leftArea_x_low = x_low - halfImageWidth;
    var leftArea_x_high = center_x - halfImageWidth - IMAGE_WIDTH;
    var leftArea_y_low = y_low - halfImageWidth;
    var leftArea_y_high = y_high + halfImageWidth;

    //右侧区域
    var rightArea_x_low = center_x + halfImageWidth;
    var rightArea_x_high = x_high - halfImageWidth;
    var rightArea_y_low = y_low - halfImageWidth;
    var rightArea_y_high = y_high + halfImageWidth;

    //设定图片位置
    //中心图片
    imageInfoList[center_img_index].position = {
      left: center_x - halfImageWidth,
      top: center_y - halfImageWidth
    };
    //左侧图片
    for (var i = 0; i < imageInfoList.length / 2; i++) {
      if (i == center_img_index) continue;
      imageInfoList[i].position = this.calcRandomPosition(leftArea_x_low, leftArea_y_low, leftArea_x_high, leftArea_y_high);
      imageInfoList[i].rotate = this.randomRotateDeg();
    }
    //右侧图片
    for (var r = imageInfoList.length / 2; r < imageInfoList.length; r++) {
      if (r == center_img_index) continue;
      imageInfoList[r].position = this.calcRandomPosition(rightArea_x_low, rightArea_y_low, rightArea_x_high, rightArea_y_high);
      imageInfoList[r].rotate = this.randomRotateDeg();
    }


  }

  calcRandomPosition(x_low, y_low, x_high, y_high) {
    var x = Math.floor(Math.random() * (x_high - x_low) + x_low);
    var y = Math.floor(Math.random() * (y_high - y_low) + y_low);
    //console.log('calcRandomPosition(), (x, y)=', x, y);
    return {left: x, top: y};
  }

  randomRotateDeg() {
    var deg = Math.floor(Math.random() * 30);
    if (Math.random() < 0.5)
      return -deg;
    else
      return deg;
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

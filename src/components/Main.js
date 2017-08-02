require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//import ReactAddons from 'react/addons';
import { findDOMNode } from 'react-dom';

//获取图片元数据
var imageInfoList = require('../data/imgDescInfo.json');
//生成图片的url和位置
imageInfoList = (function (imageInfoArr){
    imageInfoArr.forEach(function(element) {
      element.imageUrl = require('../images/' + element.fileName);
      element.position = {left: 0, top: 0};
    }, this);

    return imageInfoArr;
}(imageInfoList));

class ImgFigure extends React.Component {
  render() {
/*     var styleValue = {left: this.props.imgInfo.left,
                     top: this.props.imgInfo.top
                  }; */
    return (
            /* .img-figure样式设定position=absolute，使得style属性中的left, top起效 */
      <figure className="img-figure" style={this.props.imgInfo.position}>
        <img src={this.props.imgInfo.imageUrl} alt={this.props.imgInfo.title} />
        <figcaption>
          <h2 className="img-title">{this.props.imgInfo.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imagesInfo: imageInfoList};
  }

/*   getInitialState() {
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
    console.log('AppComponent.componentDidMount(), (stageWidth, stageHeight)=', stageWidth, stageHeight);

    this.arrangeImages(0, 0, stageWidth, stageHeight);
  }

  arrangeImages(x_low, y_low, x_high, y_high) {
    imageInfoList.forEach(function(singleImageInfo, index){
      //singleImageInfo.position = this.calcRandomPosition(x_low, y_low, x_high, y_high);
      imageInfoList[index].position = this.calcRandomPosition(x_low, y_low, x_high, y_high);
    }, this);
    console.log('AppComponent.arrangeImages(), imageInfoList=', imageInfoList);
    this.setState({
      imagesInfo: imageInfoList
    });
  }

  calcRandomPosition(x_low, y_low, x_high, y_high) {
    var x = Math.floor(Math.random() * (x_high - x_low) + x_low);
    var y = Math.floor(Math.random() * (y_high - y_low) + y_low);
    console.log('calcRandomPosition(), (x, y)=', x, y);
    return {left: x, top: y};
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

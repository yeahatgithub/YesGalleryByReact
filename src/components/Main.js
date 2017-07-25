require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');
//获取图片元数据
let imageInfoList = require('../data/imgDescInfo.json');
//生成图片的url
imageInfoList = (function (imageInfoArr){
    imageInfoArr.forEach(function(element) {
      element.imageUrl = require('../images/' + element.fileName);
    }, this);
}(imageInfoList));


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

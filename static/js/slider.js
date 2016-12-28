

function Slider(options) {
	var defaults = {
		prev: $(),
		next: $(),
		content: $(),
		item: $(),
		page: $(),
		width: 0, // 单个item宽度
		step: 1, // 步进值
		amount: 0, // 总数
		loop: true, // 是否循环
		curIndex: 0, // 当前索引值
		autoPlay: false, // 是否自动播放
		showTime: 3000, // 停留时间
		hoverPause: true
	};
	this.options =  $.extend(defaults, options);
	// console.log(defaults);
	this.timer = null;
}

// 当前内容滑出
Slider.prototype.oldAnimate = function(endleft) {
	this.options.item.eq(this.options.curIndex).stop(true).animate({
		"left": endleft
	}, 400);
}

// 新内容滑入
Slider.prototype.newAnimate = function(startleft) {
	var self = this,
		$curContent = this.options.item.eq(this.options.curIndex); // 当前内容块

	self.beforeAnimate(self.options.curIndex, $curContent); // 动画执行前回调

	$curContent.css({
		"left": startleft
	}).stop(true).animate({
		"left": 0
	}, 400, function() {
		self.onAnimate(self.options.curIndex, $curContent); // 动画执行完成后回调
	});
}

// 动画执行前回调
Slider.prototype.beforeAnimate = function(index, content) {
	if (typeof this.options.beforeAnimate === "function") {
		this.options.beforeAnimate(index, content);
	};
}

// 动画执行完成后回调
Slider.prototype.onAnimate = function(index, content) {
	if (typeof this.options.onAnimate === "function") {
		this.options.onAnimate(index, content);
	};
}

// 自动循环播放
Slider.prototype.autoPlay = function() {
	var self = this;
	
	if (this.options.autoPlay) {
		// console.log(self.timer);
		window.clearTimeout(self.timer); // 清除之前的定时器
		self.timer = window.setTimeout(function() {
			self.doNext();
		}, self.options.showTime);
	};
}

Slider.prototype.doNext = function() {
	
	if (!this.options.loop && this.options.next.hasClass("disabled")) {
		return; // 如果不循环，到队列头部后直接跳出
	};

	
	this.oldAnimate("-100%"); // 当前往左滚动
	this.getNext();
	this.newAnimate("100%");

	// page翻页效果
	if (this.options.page.length == 1) {
		this.options.page.children().removeClass("current").eq(this.options.curIndex).addClass("current");
	};

	// 自动循环播放
	this.autoPlay();

	// 不循环
	if (!this.options.loop) {
		if (this.options.curIndex >= this.options.amount - 1) {
			this.options.next.addClass("disabled");
		};
		this.options.prev.removeClass("disabled");
	};
}

Slider.prototype.doPrev = function() {
	
	if (!this.options.loop && this.options.prev.hasClass("disabled")) {
		return; // 如果不循环，到队列头部后直接跳出
	};

	this.oldAnimate("100%"); // 当前往右滚动
	this.getPrev();
	this.newAnimate("-100%");

	// 不循环
	if (!this.options.loop) {
		if (this.options.curIndex <= 0) {
			this.options.prev.addClass("disabled");
		};
		this.options.next.removeClass("disabled");
	};
}

// 获取下一个索引值
Slider.prototype.getNext = function() {
	this.options.curIndex ++;
	if (this.options.curIndex > this.options.amount - 1) {
		this.options.curIndex = 0;
	};
	// console.log(this.options.curIndex);
}

// 获取上一个索引值
Slider.prototype.getPrev = function() {
	this.options.curIndex --;
	if (this.options.curIndex < 0) {
		this.options.curIndex = this.options.amount - 1;
	};
	// console.log(this.options.curIndex);
}

// 绑定事件
Slider.prototype.bindEvent = function() {
	var self = this;

	this.options.next.on("click", function() {
		self.doNext();
	});
	this.options.prev.on("click", function() {
		self.doPrev();
	});

	// 是否自动播放
	if (this.options.autoPlay && this.options.hoverPause) {
		this.options.content.on("mouseenter", function() {
			window.clearTimeout(self.timer); // 清除自动播放
		});
		this.options.content.on("mouseleave", function() {
			self.autoPlay(); // 重新开启自动播放
		});
	};

	
}

// 初始化
Slider.prototype.init = function() {
	
	// 获取初始化数据
	this.options.item = this.options.content.children();
	this.options.width = this.options.item.eq(0).outerWidth();
	this.options.amount = this.options.item.length;

	// 小于2个item则不执行动画
	if (this.options.amount < 2) {
		return;
	};

	// 设置初始样式
	this.options.item.css({
		"position": "absolute",
		"left": "100%"
	}).eq(0).css({
		"left": "0"
	});

	// 绑定初始事件
	this.bindEvent();

	// 自动循环播放
	this.autoPlay();

	// 不循环
	if (!this.options.loop) {
		this.options.prev.addClass("disabled");
	};

	// console.log(this);
}

// 创建实例-工厂模式
function control(config) {
	var slider = new Slider(config);
	slider.init();
	return slider;
}


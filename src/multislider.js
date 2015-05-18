var MultiSlider = React.createClass({displayName: "MultiSlider",
	domNode: null,

	getInitialState: function(){
		return {
			dragging: false,
			currentKey: null,
			nextKey: null,
			buckets: this.props.buckets
		};
	},
	handleMouseDown: function(downEvent){
		var handleEl = downEvent.target;

		var nextKey = handleEl.parentNode.nextSibling.querySelector('.handle').getAttribute('data-key');

		this.setState({
			currentKey: handleEl.getAttribute('data-key'),
			nextKey: nextKey,
			dragStartY: downEvent.pageY,
			currentPercentage: handleEl.parentNode.offsetHeight / this.domNode.offsetHeight,
			nextPercentage: handleEl.parentNode.nextSibling.offsetHeight / this.domNode.offsetHeight
		});

		window.addEventListener('mousemove', this.moveEventHandler);
		window.addEventListener('mouseup', this.upEventHandler);
	},
	moveEventHandler: function(moveEvent) {

		var diffPercentage = (moveEvent.pageY - this.state.dragStartY) / this.domNode.offsetHeight;

		var newPercentage = Math.ceil((this.state.currentPercentage + diffPercentage) * 1000) / 10;

		var newNextPercentage = Math.floor((this.state.nextPercentage - diffPercentage) * 1000) / 10;

		var updatedBuckets = this.setBucketPercentages(this.state.buckets, this.state.currentKey, this.state.nextKey, newPercentage, newNextPercentage)

		this.setState({dragging:true, buckets: updatedBuckets});

	},
	upEventHandler: function() {
		window.removeEventListener('mousemove', this.moveEventHandler);
		window.removeEventListener('mouseup', this.upEventHandler);
		this.setState({dragging: false, currentKey: null, nextKey: null});
	},
	setBucketPercentages: function(buckets, currentKey, nextKey, currentPercentage, nextPercentage){
		return buckets.map(function(item){
			if(item.key === currentKey){
				item.value = currentPercentage;
			} else if (item.key === nextKey){
				item.value = nextPercentage;
			}
			return item;
		});
	},
	componentDidMount: function(){
		if(!this.domNode){
			this.domNode = React.findDOMNode(this.refs.collectionRoot);
		}
	},
  render: function() {
		var buckets;
		var collectionClass = this.state.dragging ? 'dragging bucket-collection' : 'bucket-collection';
		if(this.state.buckets){
			buckets = this.state.buckets.map(function(bucket){
				var percentage = Number(bucket.value).toFixed(1) + '%';
				var bucketClass = bucket.key + ' bucket';
				if(bucket.key === this.state.currentKey){
					bucketClass += ' active';
				}
				return (
					React.createElement("div", {ref: bucket.key, className: bucketClass, style: {height: percentage}}, 
						React.createElement("span", null, percentage), 
						React.createElement("div", {className: "handle", onMouseDown: this.handleMouseDown, "data-key": bucket.key})
					)
				);
			}, this);
		}
    return (
    	React.createElement("div", {className: "multibar-slider"}, 
    		React.createElement("div", {ref: "collectionRoot", className: collectionClass}, 
    			buckets
    		)
    	)
    );
  }
});

window.MultiSlider = MultiSlider;

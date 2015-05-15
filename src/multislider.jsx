var MultiSlider = React.createClass({
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

		this.domNode.addEventListener('mousemove', this.moveEventHandler);
		this.domNode.addEventListener('mouseup', this.upEventHandler);
	},
	moveEventHandler: function(moveEvent) {

		var diffPercentage = (moveEvent.pageY - this.state.dragStartY) / this.domNode.offsetHeight;

		var newPercentage = Math.ceil((this.state.currentPercentage + diffPercentage) * 1000) / 10;

		var newNextPercentage = Math.floor((this.state.nextPercentage - diffPercentage) * 1000) / 10;

		var updatedBuckets = this.setBucketPercentages(this.state.buckets, this.state.currentKey, this.state.nextKey, newPercentage, newNextPercentage)

		this.setState({dragging:true, buckets: updatedBuckets});

	},
	upEventHandler: function() {
		this.domNode.removeEventListener('mousemove', this.moveEventHandler);
		this.domNode.removeEventListener('mouseup', this.upEventHandler);
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
					<div ref={bucket.key} className={bucketClass} style={{height: percentage}}>
						<span>{percentage}</span>
						<div className="handle" onMouseDown={this.handleMouseDown} data-key={bucket.key}></div>
					</div>
				);
			}, this);
		}
    return (
    	<div className="multibar-slider">
    		<div ref="collectionRoot" className={collectionClass}>
    			{buckets}
    		</div>
    	</div>
    );
  }
});

window.MultiSlider = MultiSlider;

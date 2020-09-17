import { Button, Divider, Typography } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "../style/UniformStyle.css";
import { FourPictures } from "../utils/Utils";

const { Title, Text, Paragraph } = Typography;

class Section5 extends Component {
	constructor(props) {
		super();
		this.state = {
			value: -1,
		};
	}
	render() {
		const picture1 = require("../../Site/Images/Comprehending_S_Example_1.JPG");
		const picture2 = require("../../Site/Images/Comprehending_S_Example_2.JPG");
		const picture3 = require("../../Site/Images/Comprehending_S_Example_3.JPG");
		const picture4 = require("../../Site/Images/Comprehending_S_Example_4.JPG");

		return (
			<div style={{ padding: "30px", fontSize: this.props.fontSize }}>
				<Title level={3} align="left">
					SECTION 5: COMPREHENDING SENTENCES
				</Title>
				<Divider />
				<div>
					<ul>
						<li style={{ fontSize: this.props.fontSize }}>
							<Text style={{ color: "black" }}>
								First, click the PLAY button below to listen to a sentence.
							</Text>
						</li>
						<li style={{ fontSize: this.props.fontSize }}>
							<Text style={{ color: "black" }}>You will hear the sentence three times.</Text>
						</li>
						<li style={{ fontSize: this.props.fontSize }}>
							<Text style={{ color: "black" }}>
								Then, you need to select the picture that goes with that sentence.
							</Text>
						</li>
					</ul>
				</div>
				<div style={{ marginTop: "40px" }}>
					<Title level={4} align="left">
						SAMPLE ITEMS
					</Title>
					<Divider />
				</div>
				<div>
					<FourPictures picture1={picture1} picture2={picture2} picture3={picture3} picture4={picture4} />
				</div>

				<div style={{ marginLeft: "5%", marginTop: "40px" }}>
					<div style={{ marginTop: "20px", float: "right" }}>
						<Button danger style={{ color: "green", borderColor: "green" }}>
							<Link to="/section5_1">Next</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {
		sessionNum: state.sessionNum,
		fontSize: state.fontSize,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		dispatch1: () => {
			dispatch();
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Section5);
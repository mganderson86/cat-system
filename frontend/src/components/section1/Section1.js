import { Col, Divider, Radio, Row, Typography } from "antd"; //Button is not used in this page
import React, { Component } from "react";
import { connect } from "react-redux";
/* import { Link } from "react-router-dom"; // not used in this page */
import Pic from "../../play.png";
import ReactAudioPlayer from "react-audio-player";
import { TwoPictures, NextButton } from "../utils/Utils";

const { Title, Text } = Typography;

class Section1 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: -1,
			blank: "_______",
			radioColor: ["black", "black", "black", "black"],
			showElem: "none",
		};
	}

	playAudio = () => {
		this.setState({
			showElem: "inline",
		});
	};

	onChange = (e) => {
		let choice = ["but", "then", "so", "also"];
		this.setState({
			value: e.target.value,
			blank: choice[e.target.value],
		});

		let newRadioColor = ["black", "black", "black", "black"];
		newRadioColor[e.target.value] = "green";
		this.setState({ radioColor: newRadioColor });
	};

	render() {
		const choice = ["but", "then", "so", "also"];
		const questionText1 = "Kate wears sneakers, ";
		const questionText2 = " Jim wears sandals.";
		const picture1 = require("../../Site/Images/ConnectingIdeaExamplePic1.jpg");
		const picture2 = require("../../Site/Images/ConnectingIdeaExamplePic2.jpg");
		const audio = "../../Site/audio/Task_1_Connecting_Ideas_Directions.mp3";

		return (
			<div className="main-context-div" style={{ fontSize: this.props.fontSize }}>
				<div className="section">
					<Title level={3} align="left">
						SECTION 1: CONNECTING IDEAS
					</Title>
					<span style={{ marginBottom: "5px", height: "50px" }}>
							<img onClick={this.playAudio} src={Pic} height="54px" width="54px" alt="img" />
							<ReactAudioPlayer
								style={{ display: this.state.showElem, verticalAlign: "middle" }}
								src={audio}
								controls
							></ReactAudioPlayer>
						</span>
					<Divider style={{ margin: "10px" }} />
					<div>
						<ul>
							<li>
								<Text className="text_div" style={{ color: "black" }}>
									First, read the sentences.
								</Text>
							</li>
							<li>
								<Text className="text_div" style={{ color: "black" }}>
									Then, click the option that best completes the sentences.
								</Text>
							</li>
							<li>
								<Text className="text_div" style={{ color: "black" }}>
									Some sentences have pictures, others do not.
								</Text>
							</li>
						</ul>
					</div>

					<div style={{ marginTop: "20px" }}>
						<Title level={4} align="left">
							SAMPLE ITEM
						</Title>
						<Divider />
						<TwoPictures picture1={picture1} picture2={picture2} />
					</div>

					<div style={{ marginTop: "10px" }}>
						<Row>
							<Col span={20} offset={2}>
								<Text strong className="text_div" style={{ color: "black" }}>
									{questionText1}
								</Text>
								<Text underline strong style={{ color: "green" }}>
									{this.state.blank}
								</Text>
								<Text strong className="text_div" style={{ color: "black" }}>
									{questionText2}
								</Text>

								<div style={{ margin: "15px" }}>
									<Radio.Group onChange={this.onChange} size="large" value={this.state.value}>
										<Radio
											style={{
												color: this.state.radioColor[0],
												fontSize: this.props.fontSize,
											}}
											value={0}
										>
											{choice[0]}
										</Radio>
										<Radio
											style={{
												color: this.state.radioColor[1],
												fontSize: this.props.fontSize,
											}}
											value={1}
										>
											{choice[1]}
										</Radio>
										<Radio
											style={{
												color: this.state.radioColor[2],
												fontSize: this.props.fontSize,
											}}
											value={2}
										>
											{choice[2]}
										</Radio>
										<Radio
											style={{
												color: this.state.radioColor[3],
												fontSize: this.props.fontSize,
											}}
											value={3}
										>
											{choice[3]}
										</Radio>
									</Radio.Group>
								</div>
							</Col>
						</Row>
					</div>
				</div>
				<NextButton link="/section1_1" />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		fontSize: state.fontSize,
	};
};

export default connect(mapStateToProps)(Section1);

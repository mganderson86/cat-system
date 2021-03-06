import { Col, Radio, Row, Typography, notification } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NextQuestionButton, SectionBar } from "../utils/Utils";
import FetchData from "../utils/FetchData";
import Pic from "../../play.png";
import ReactAudioPlayer from "react-audio-player";

const { Paragraph } = Typography;

const openNotification = () => {
	notification.open({
		message: "You should select an option to go next.",
		duration: 2.5,
	});
};

class UnderstandingResponses extends Component {
	constructor(props) {
		super();
		this.state = {
			delay: false,
			selectOption: -1,
			question: "meta_disagreeing",
			showElem: "none",
		};
	}

	playAudio = () => {
		this.setState({
			showElem: "inline",
		});
	};

	nextQuestionDelay = () => {
		this.setState({ delay: true });
		setTimeout(() => {
			this.getNextQuestion();
			this.setState({ delay: false });
		}, 1000);
	};


	onChange = (e) => {
		this.setState({
			selectOption: e.target.value,
		});
	};

	getNextQuestion = async (e) => {
		if (this.state.selectOption === -1) {
			openNotification();
			return;
		}

		let catAns = {
			question: this.state.question,
			answer: this.state.selectOption,
		};
		
		let id = sessionStorage.getItem("ID");
		
		if (id !== null ) {
			await FetchData("/UpdateCATAnswer/" + id, "PUT", catAns).then((res) => res.json());
		} else {
				alert("No ID set. You will be returned to the beginning.");
				return this.props.history.push("/demo");
		}

		let judgeOfAnswer;
		const correctAns = this.props.curState.METALINGUISTIC[this.state.question].answer;

		if (correctAns === this.state.selectOption) {
			judgeOfAnswer = "r." + this.state.question;
		} else {
			judgeOfAnswer = "w." + this.state.question;
		}

		await this.props.answerQuestionAns(judgeOfAnswer, this.state.question);

		let data = {
			questionAns: this.props.curState.questionAns,
			questionAnsSum: this.props.curState.questionAnsSum,
			questions: this.props.curState.questions,
			questionSum: this.props.curState.questionSum,
			sectionName: "METALINGUISTIC",
			numQuestions: this.props.curState.numQuestions,
		};

		this.setState({
			selectOption: -1,
		});

		await FetchData("/sumCorrectIncorrect", "PUT", data)
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				} else {
				}
			})
			.then((res) => {
				console.log(res);
				if (res.nextQuestion === "") {
					this.props.clearNumQuestions();
					this.props.history.push("/questionnaire");
				} else {
					this.setState({ question: res.nextQuestion });
				}
			});
	};

	render() {
		const newspaper = this.props.curState.METALINGUISTIC[this.state.question].newspaper;
		const news = this.props.curState.METALINGUISTIC[this.state.question].news;
		const people = this.props.curState.METALINGUISTIC[this.state.question].people;
		const idea = this.props.curState.METALINGUISTIC[this.state.question].idea;
		const ask = this.props.curState.METALINGUISTIC[this.state.question].ask;
		const img = require("../../Site/section8_images/" +
			this.props.curState.METALINGUISTIC[this.state.question].img);
		const options = this.props.curState.METALINGUISTIC[this.state.question].options;
		const audio = this.props.curState.METALINGUISTIC[this.state.question].audio;
		const qType = this.props.curState.METALINGUISTIC[this.state.question].type;

		const bubble = require("../../Site/section8_images/meta_speechbubble.png");
		const paper = require("../../Site/section8_images/meta_newspaper.png");
		const pencil = require("../../Site/section8_images/meta_pencil.png");

		const radioStyle = {
			display: "block",
			height: "30px",
			lineHeight: "30px",
			color: "black",
		};
		
				
		function questionStyle() {
			
			if (qType === "bubble") {
				return {
					color: "black",
					backgroundImage: `url(${bubble})`,
					backgroundSize: "100% 100%",
					padding: "20px",
					paddingLeft: "100px"
				}
			}
			else {
				return {
					color: "black",
					backgroundImage: `url(${pencil})`,
					backgroundRepeat: "no-repeat",
					padding: "20px",
					paddingLeft: "100px"
				}
			}
		}

		return (
			<div className="main-context-div " style={{ fontSize: this.props.fontSize }}>
				<div className="understanding_responses">
					<div style={{ marginBottom: "5px", height: "50px" }}>
						<img onClick={this.playAudio} src={Pic} height="54px" width="54px" alt="img" />
						<ReactAudioPlayer
							style={{ display: this.state.showElem, verticalAlign: "middle" }}
							src={audio}
							controls
						></ReactAudioPlayer>
					</div>
					<Row>
						<div
							style={{
								color: "black",
								backgroundImage: `url(${paper})`,
								backgroundSize: "100% 100%",
								padding: "40px",
							}}
						>
							<Paragraph strong>{newspaper}</Paragraph>
							<Paragraph>{news}</Paragraph>
						</div>
					</Row>
					<Row>
						<Col span={2} offset={0}>
							<img src={img} height="80px" alt="img" />
						</Col>
						<Col  offset={1}>
						<div>
							<Paragraph strong>{people}</Paragraph>
							<div
								style={questionStyle()}
							>
								{idea}
							</div>
							<Paragraph>{ask}</Paragraph>

							<Radio.Group onChange={this.onChange} value={this.state.selectOption}>
								{options.map((option, index) => (
									<Radio style={radioStyle} key={index} value={index + 1}>
										{option}
									</Radio>
								))}
							</Radio.Group>
						</div>
						</Col>
					</Row>
				</div>

				<NextQuestionButton getNextQuestion={this.nextQuestionDelay} delay={this.state.delay} />
				<div style={{ position: "absolute", bottom: "0px", width: "100%" }}>
					<SectionBar numSection={8} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		fontSize: state.fontSize,
		curState: state,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		answerQuestionAns(questionAns, question) {
			const action = {
				type: "ANSWER_QUESTION",
				questionAns: questionAns,
				question: question,
			};
			dispatch(action);
		},
		clearNumQuestions() {
			const action = {
				type: "CLEAR_NUM_QUESTION",
			};
			dispatch(action);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UnderstandingResponses);

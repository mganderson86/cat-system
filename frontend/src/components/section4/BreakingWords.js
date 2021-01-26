import { Col, notification, Row } from "antd";
import React, { Component } from "react";
import ReactAudioPlayer from "react-audio-player";
import { connect } from "react-redux";
import Pic from "../../play.png";
import FetchData from "../utils/FetchData";
import { NextQuestionButton, SectionBar } from "../utils/Utils";


const openNotification = () => {
	notification.open({
		message: "You should type an answer to go next.",
		duration: 2.5,
	});
};
const wordBox = require("../../Site/Images/task4_6_wordbox.png");

function firstUpperCase(s) {
	return s.replace(/^\S/, (s) => s.toUpperCase());
}

class BreakingWords extends Component {
	constructor(props) {
		super();

		this.state = {
			delay: false,
			answerText: "",
			question: "Morpho_activity",
			showElem: "none",
		};
	}

	onChange = (e) => {
		this.setState({ answerText: e.target.value });
	};

	nextQuestionDelay = () => {
		this.setState({ delay: true });
		setTimeout(() => {
			this.getNextQuestion();
			this.setState({ delay: false });
		}, 1000);
	};

	playAudio = () => {
		this.setState({
			showElem: "inline",
		});
	};

	getNextQuestion = async (e) => {
		if (this.state.answerText === "") {
			openNotification();
			return;
		}

		let catAns = {
			question: this.state.question,
			answer: this.state.answerText,
		};
		
		let id = sessionStorage.getItem("ID");
		
		if (id !== null ) {
			await FetchData("/UpdateCATAnswer/" + id, "PUT", catAns).then((res) => res.json());
		} else {
				alert("No ID set. You will be returned to the beginning.");
				return this.props.history.push("/demo");
		}

		let judgeOfAnswer;
		const correctAns = this.props.curState[this.state.question].answer;

		if (correctAns.includes(this.state.answerText)) {
			judgeOfAnswer = "r." + this.state.question;
		} else {
			judgeOfAnswer = "w." + this.state.question;
		}

		console.log(judgeOfAnswer)

		await this.props.answerQuestionAns(judgeOfAnswer, this.state.question);

		let data = {
			questionAns: this.props.curState.questionAns,
			questionAnsSum: this.props.curState.questionAnsSum,
			questions: this.props.curState.questions,
			questionSum: this.props.curState.questionSum,
			sectionName: "MORPHOLOGY",
			numQuestions: this.props.curState.numQuestions,
		};

		this.setState({
			answerText: "",
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
					this.props.history.push("/section5");
				} else {
					this.setState({ question: firstUpperCase(res.nextQuestion) });
				}
			});
	};

	render() {
		const questionText1 = this.props.curState[this.state.question].text1;
		const questionText2 = this.props.curState[this.state.question].text2;
		const keyword = this.props.curState[this.state.question].keyword;
		const audio = this.props.curState[this.state.question].audio;

		return (
			<div className="main-context-div" style={{ fontSize: this.props.fontSize }}>
				<div className="breaking_words">
					<div style={{ marginBottom: "5px", height: "50px" }}>
						<img onClick={this.playAudio} src={Pic} height="54px" width="54px" alt="img" />
						<ReactAudioPlayer
							style={{ display: this.state.showElem, verticalAlign: "middle" }}
							src={audio}
							controls
						></ReactAudioPlayer>
					</div>
					<Row>
						<Col span={5}>
							<div
								style={{
									color: "black",
									fontWeight: "bold",
									backgroundImage: `url(${wordBox})`,
									backgroundSize: "100% 100%",
									padding: "5px",
									paddingRight: "35px",
									textAlign: "center",
								}}
							>
								{keyword}{" "}
							</div>
						</Col>
						<Col offset={1}>
							{questionText1} <input value={this.state.answerText} onChange={this.onChange} />{" "}
							{questionText2}
						</Col>
					</Row>
				</div>

				<NextQuestionButton getNextQuestion={this.nextQuestionDelay} delay={this.state.delay} />

				<div style={{ position: "absolute", bottom: "0px", width: "100%" }}>
					<SectionBar numSection={4} />
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

export default connect(mapStateToProps, mapDispatchToProps)(BreakingWords);

import { notification, Radio, Row, Typography } from "antd";
import React, { Component } from "react";
import ReactAudioPlayer from "react-audio-player";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from "redux";
import Pic from "../../play.png";
import FetchData from "../utils/FetchData";
import { NextQuestionButton, SectionBar } from "../utils/Utils";

const { Text } = Typography;

function firstUpperCase(s) {
	return s.replace(/^\S/, (s) => s.toUpperCase());
}

const openNotification = () => {
	notification.open({
		message: "You should choose an option to go next.",
		duration: 2.5,
	});
};

const SectionName = "CONNECTIVES_SENTENCES";

class ConnectSentence extends Component {
	constructor(props) {
		super();
		this.state = {
			bodyText: "",
			delay: false,
			blank: "________________",
			selectOption: -1,
<<<<<<< HEAD
			question: "Connect_sent_however",
=======
			//question: "Connect_sent_however",
         question: "Connect_sent_nonetheless_B",  //will always start at this question for form A
>>>>>>> 5cbefb8... New files for form 2A
			radioColor: ["black", "black", "black"],
			showElem: "none",
		};
	}

	onChange = (e) => {
		let choice = this.props.curState[this.state.question].choice;

		this.setState({
			selectOption: e.target.value,
			blank: choice[e.target.value],
		});

		let newRadioColor = ["black", "black", "black"];
		newRadioColor[e.target.value] = "green";
		this.setState({ radioColor: newRadioColor });
	};

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

	getNextQuestion = async (e) => {
		if (this.state.selectOption === -1) {
			openNotification();
			return;
		}

		let ans;
		switch (this.state.selectOption) {
<<<<<<< HEAD
			case 1:
				ans = "A";
				break;
			case 2:
				ans = "B";
				break;
			case 3:
=======
			case 0:
				ans = "A";
				break;
			case 1:
				ans = "B";
				break;
			case 2:
>>>>>>> 5cbefb8... New files for form 2A
				ans = "C";
				break;
			default:
				break;
		}

		let catAns = {
			question: this.state.question,
			answer: ans,
		};
		let id = sessionStorage.getItem("ID");
		//console.log(id)
		if (id !== null ) {
			await FetchData("/UpdateCATAnswer/" + id, "PUT", catAns).then((res) => res.json());
		} else {
				alert("No ID set. You will be returned to the beginning.");
				return this.props.history.push("/demo");
		}

		let judgeOfAnswer;
		const correctAns = this.props.curState[this.state.question].answer - 1;

		if (correctAns === this.state.selectOption) {
			judgeOfAnswer = "r." + this.state.question;
		} else {
			judgeOfAnswer = "w." + this.state.question;
		}
<<<<<<< HEAD
		// console.log("judgeOfAnswer: " + judgeOfAnswer);
=======
		// console.log("judgeOfAnswer: =====> " + judgeOfAnswer);
>>>>>>> 5cbefb8... New files for form 2A

		await this.props.answerQuestionAns(judgeOfAnswer, this.state.question);

		let data = {
			questionAns: this.props.curState.questionAns,
			questionAnsSum: this.props.curState.questionAnsSum,
			questions: this.props.curState.questions,
			questionSum: this.props.curState.questionSum,
			sectionName: SectionName,
			numQuestions: this.props.curState.numQuestions,
		};

		this.setState({
			selectOption: -1,
			radioColor: ["black", "black", "black"],
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
					this.props.history.push("/section2");
				} else {
					this.setState({ question: firstUpperCase(res.nextQuestion) });
					this.setState({ blank: "________________" });
				}
			});
	};

	render() {
		let choice = this.props.curState[this.state.question].choice;
		let questionText1 = this.props.curState[this.state.question].text1;
		let questionText2 = this.props.curState[this.state.question].text2;
		let audio = this.props.curState[this.state.question].audio;

		return (
			<div className="main-context-div" style={{ fontSize: this.props.curState.fontSize }}>
				<div className="connect_sentence">
					<Row>
						<div style={{ marginBottom: "5px", height: "50px" }}>
							<img onClick={this.playAudio} src={Pic} height="54px" width="54px" alt="img" />
							<ReactAudioPlayer
<<<<<<< HEAD
								style={{ display: this.state.showElem, verticalAlign: "middle" }}
								src={audio}
								controls
=======
								style={{ display: this.playAudio, verticalAlign: "middle" }}
								src={audio}
								controls
								controlsList="nodownload"
>>>>>>> 5cbefb8... New files for form 2A
							></ReactAudioPlayer>
						</div>
					</Row>
					<Row>
						<div style={{ fontSize: this.props.curState.fontSize, margin: "10px" }}>
							<Text className="text_div" style={{ color: "black" }}>
								{questionText1}
							</Text>
							<Text strong style={{ color: "black" }}>
								{questionText2}
							</Text>
							<Text underline style={{ color: "green" }}>
								{this.state.blank}
							</Text>
						</div>
					</Row>
					<Row>
						<div style={{ margin: "10px", paddingLeft: "20px" }}>
							<Radio.Group size="large" onChange={this.onChange} value={this.state.selectOption}>
								<Radio
									style={{
										color: this.state.radioColor[0],
										fontSize: this.props.curState.fontSize,
										display: "block",
									}}
									value={0}
								>
									{choice[0]}
								</Radio>
								<Radio
									style={{
										color: this.state.radioColor[1],
										fontSize: this.props.curState.fontSize,
										display: "block",
									}}
									value={1}
								>
									{choice[1]}
								</Radio>
								<Radio
									style={{
										color: this.state.radioColor[2],
										fontSize: this.props.curState.fontSize,
										display: "block",
									}}
									value={2}
								>
									{choice[2]}
								</Radio>
							</Radio.Group>
						</div>
					</Row>

					{/* <Row justify="end">
						<div style={{ marginTop: "20px", float: "right" }}>
							<Button
								size={this.props.curState.fontSize}
								danger
								onClick={this.getNextQuestion}
								style={{ color: "green", borderColor: "green" }}
							>
								Next
							</Button>
						</div>
					</Row> */}
				</div>

				<NextQuestionButton getNextQuestion={this.nextQuestionDelay} delay={this.state.delay} />

				<div style={{ position: "absolute", bottom: "0px", width: "100%" }}>
					<SectionBar numSection={1} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
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

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ConnectSentence);

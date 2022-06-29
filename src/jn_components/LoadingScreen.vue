<template>
	<div class="loader">
		<div class="text-container">
			<span>Forbereder PDF...</span>
		</div>
	</div>
</template>


<style>
.loader {
	background-color: rgba(0, 0, 0, 0.6);
	bottom: 0;
	color: white;
	display: block;
	font-size: 32px;
	left: 0;
	overflow: hidden;
	padding-top: 10vh;
	position: fixed;
	right: 0;
	text-align: center;
	top: 0;
	z-index: 9999;
}
.text-container {
	z-index: 1011;
	position: fixed;
	padding: 15px;
	margin: 0px;
	width: 30%;
	top: 40%;
	left: 35%;
	text-align: center;
	color: white;
	border: none;
	background-color: rgb(0, 0, 0);
	cursor: wait;
	border-radius: 10px;
	opacity: 0.6;
}
</style>
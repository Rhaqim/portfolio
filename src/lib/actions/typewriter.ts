// src/lib/actions/typewriter.ts

export function typewriter(
	node: HTMLDivElement,
	options: {
		messages: string[];
		typingSpeed?: number;
		pauseTime?: number;
	}
) {
	let { messages, typingSpeed = 100, pauseTime = 2000 } = options;
	let currentMessageIndex = 0;
	let charIndex = 0;
	let typingInterval: ReturnType<typeof setInterval>;
	let pauseTimeout: ReturnType<typeof setTimeout>;

	function startTyping() {
		const currentMessage = messages[currentMessageIndex];
		console.log(currentMessage);
		charIndex = 0;
		node.textContent = "";

		typingInterval = setInterval(() => {
			if (charIndex < currentMessage.length) {
				node.textContent += currentMessage[charIndex];
				charIndex++;
			} else {
				clearInterval(typingInterval);
				pauseTimeout = setTimeout(() => {
					currentMessageIndex = (currentMessageIndex + 1) % messages.length;
					startTyping();
				}, pauseTime);
			}
		}, typingSpeed);
	}

	startTyping();

	return {
		update(newOptions: typeof options) {
			// Update options dynamically if needed
			messages = newOptions.messages;
			typingSpeed = newOptions.typingSpeed ?? 100;
			pauseTime = newOptions.pauseTime ?? 2000;
		},
		destroy() {
			clearInterval(typingInterval);
			clearTimeout(pauseTimeout);
		},
	};
}

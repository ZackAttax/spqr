build:
	scarb build

declare:
	sncast declare --package spqr --fee-token eth --contract-name Spqr

deploy:
	sncast deploy \
		--fee-token eth \
		--class-hash 0x060084bbf15c966bff839707b9b4b4f15f8c8c5e96ce8977f8134b8828fded2b \
		--constructor-calldata 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d 0x16409cfef9b6c3e6002133b61c59d09484594b37b8e4daef7dcba5495a0ef1a 0x3fdf057feea8950c3fa8c6fcdda0d51057ad1dc496c0ba532a259fbf1b8edd9

approve:
	sncast invoke \
		--contract-address 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d \
		--function "approve" \
		--fee-token eth \
		--arguments '0x05a10ca183a645a0edb7168d02f44ddfd7dfdb4ad84f2a5a7a9d36614e439ceb, 42'

shield:
	sncast invoke \
		--contract-address 0x05a10ca183a645a0edb7168d02f44ddfd7dfdb4ad84f2a5a7a9d36614e439ceb\
		--function "shield_amount" \
		--fee-token eth \
		--calldata 42 0 0x754ac441612445c48d79fa5bb22c5e2560c4ba44965436d08acfd3d91cf5cca 6 0x5 0x0 0x2a 0x0 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1 0x7b

transfer:
	sncast invoke \
		--contract-address 0x05a10ca183a645a0edb7168d02f44ddfd7dfdb4ad84f2a5a7a9d36614e439ceb \
		--function "transfer" \
		--fee-token eth \
		--calldata 0x754ac441612445c48d79fa5bb22c5e2560c4ba44965436d08acfd3d91cf5cca 0xe2b33228cfa7d1395a3210d97e1d57af7921646b91aea80b97caa310fa9706 0x180e9e64505e61d9fd87a2f60b443971862197d2396038620b99a936eea7f79 0x77ea950b7f12f27c0da054234c7d96e595ece30ea781ef984ee84bbfa3972d4 0x13 0x12 0x1 0x2a 0x0 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1 0x7b 0x0 0x0 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1 0x7b 0x15 0x0 0x579e8877c7755365d5ec1ec7d3a94a457eff5d1f40482bbe9729c064cdead2 0x141 0x15 0x0 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1 0xea 0x0

unshield:
	sncast invoke \
		--contract-address 0x05a10ca183a645a0edb7168d02f44ddfd7dfdb4ad84f2a5a7a9d36614e439ceb\
		--function "unshield_amount" \
		--fee-token eth \
		--calldata 0x1a62446e05ee60540d94b2e731ed037a1798065f9b8e719e293180b493b91f7 21 0 0x180e9e64505e61d9fd87a2f60b443971862197d2396038620b99a936eea7f79 0x8 0x7 0x2 0x15 0x0 0x579e8877c7755365d5ec1ec7d3a94a457eff5d1f40482bbe9729c064cdead2 0x141 0x1 0x1a62446e05ee60540d94b2e731ed037a1798065f9b8e719e293180b493b91f7

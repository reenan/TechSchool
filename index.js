const express = require('express')
const bodyParser = require('body-parser')

const { abrirConexao } = require('./mysql')
let conexao

const app = express()

app.use(bodyParser.json())

app.get('/pessoas', (req, res) => {
    conexao.query('SELECT * FROM Pessoa', (error, results) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        res.json(results)
    })
})

app.post('/pessoas', (req, res) => {
    const {
        cpf,
        nome,
        idade,
        endereco,
        altura,
        possuiBolsa,
        estadoCivil
    } = req.body

    conexao.query(`
        INSERT INTO Pessoa 
            (cpf, nome, idade, altura, endereco, estado_civil, bolsa_estudos)
            VALUES
            ('${cpf}', '${nome}', '${idade}', '${altura}', '${endereco}',
            '${estadoCivil}', '${possuiBolsa ? '1' : '0'}')
    `, (error, results) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        res.status(201).send('Pessoa cadastrada')
    })
})

app.get('/pessoas/:cpf', (req, res) => {
    const { cpf } = req.params

    conexao.query(`SELECT 
        cpf, nome, idade, altura, endereco, 
        estado_civil as estadoCivil,
        bolsa_estudos as possuiBolsa
        FROM Pessoa WHERE cpf='${cpf}'`, (error, results) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        res.json(results[0])
    })
})

app.put('/pessoas/:cpf', (req, res) => {
    const { cpf } = req.params
    const { nome, idade, endereco, altura, estadoCivil, possuiBolsa } = req.body

    conexao.query(`UPDATE Pessoa SET
        nome='${nome}',
        idade='${idade}',
        endereco='${endereco}',
        altura='${altura}',
        estado_civil='${estadoCivil}',
        bolsa_estudos='${possuiBolsa ? '1' : '0'}'
        WHERE cpf='${cpf}'
    `, (error, results) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        res.send('Pessoa atualizada')
    })
})

app.delete('/pessoas/:cpf', (req, res) => {
    const { cpf } = req.params

    conexao.query(`DELETE FROM Pessoa WHERE cpf='${cpf}'`, (error) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }
        res.send('Pessoa deletada')
    })
})

app.get('/pessoas/:cpf/pets', (req, res) => {
    const { cpf } = req.params

    conexao.query(`SELECT * FROM Pet
        WHERE cpf_dono = '${cpf}'`, (error, results) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }
        res.json(results)
    })
})

app.get('/pessoas/:cpf/pets/:codigo', (req, res) => {
    const { codigo } = req.params

    conexao.query(`SELECT * FROM Pet 
    WHERE codigo='${codigo}'`, (error, results) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        res.json(results[0])
    })
})

app.post('/pessoas/:cpf/pets', (req, res) => {
    const { cpf } = req.params
    const { adotado, especie, nome, raca, idade } = req.body

    conexao.query(`INSERT INTO Pet
        (cpf_dono, adotado, especie, nome, raca, idade)
        VALUES ('${cpf}', '${adotado ? '1' : '0'}', '${especie}', '${nome}', '${raca}', '${idade}')`,
        (error) => {
            if (error) {
                console.error(error)
                return res.sendStatus(500)
            }

            res.status(201).send('Pet criado')
        })
})

app.put('/pessoas/:cpf/pets/:codigo', (req, res) => {
    const { codigo } = req.params
    const { adotado, especie, nome, raca, idade } = req.body

    conexao.query(`UPDATE Pet SET
        especie='${especie}',
        nome='${nome}',
        raca='${raca}',
        idade='${idade}',
        adotado='${adotado ? '1' : '0'}'
        WHERE codigo='${codigo}'
    `, (error) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        res.send('Pet atualizado')
    })
})

app.delete('/pessoas/:cpf/pets/:codigo', (req, res) => {
    const { codigo } = req.params

    conexao.query(`DELETE FROM Pet WHERE codigo='${codigo}'`, (error) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        res.send('Pet deletado')
    })
})

app.use(express.static('./ui'))

app.listen(3000, async () => {       
    console.log('servidor escutando na porta 3000')

    conexao = await abrirConexao()
    console.log(conexao.state)
})
